/**
 * @file discussionController.js
 * @description Discussions Prof ↔ Responsable(s) de classe (MongoDB).
 * Le prof envoie infos/supports à une classe → un fil est créé/continué avec
 * le(s) responsable(s) de cette filière, qui reçoivent une notification et
 * peuvent répondre. Le temps réel est poussé dans la salle `discussion_<id>`.
 */

const Discussion = require('../models/Discussion');
const DiscussionMessage = require('../models/DiscussionMessage');
const Notification = require('../models/Notification');
const { getPool } = require('../config/postgres');
const logger = require('../utils/logger');

// --- Helpers rôle ---
const isProf = (u) => u && u.role === 'professeur';
const isResponsable = (u) => u && u.role === 'student' && !!u.is_responsable;

const senderTypeFromRole = (role) => {
  if (role === 'professeur') return 'professeur';
  if (role === 'chef_departement') return 'chef';
  if (role === 'super_admin') return 'admin';
  return 'responsable';
};

const canAccess = (user, discussion) => {
  if (isProf(user)) return Number(discussion.professeur_id) === Number(user.id);
  if (isResponsable(user)) return Number(discussion.filiere_id) === Number(user.filiere_id);
  return false;
};

// --- Helpers MySQL (filières / responsables) ---
async function getFiliereInfo(filiereId) {
  const [rows] = await getPool().query(
    'SELECT id, nom, departement_id FROM filieres WHERE id = ?',
    [filiereId]
  );
  return rows[0] || null;
}

async function getResponsables(filiereId) {
  const [rows] = await getPool().query(
    'SELECT id, nom, prenom FROM users WHERE filiere_id = ? AND is_responsable = true AND is_active = true',
    [filiereId]
  );
  return rows;
}

async function notifyResponsables(io, filiereId, discussion, message, sender) {
  try {
    const responsables = await getResponsables(filiereId);
    for (const r of responsables) {
      const notif = await Notification.create({
        user_id: r.id,
        type: 'message',
        titre: `Message du professeur ${sender.prenom || ''} ${sender.nom || ''}`.trim(),
        message: message.type === 'file'
          ? `Support de cours reçu : ${message.file_name || 'document'}`
          : message.content,
        action_url: '/responsable/discussions',
        data: { discussion_id: String(discussion._id), filiere_id: Number(filiereId) },
      });
      if (io) io.to(`user_${r.id}`).emit('notification', notif);
    }
  } catch (e) {
    logger.error('notifyResponsables error:', e);
  }
}

// POST /api/discussions/upload  (support de cours → renvoie une URL réutilisable)
exports.uploadSupport = (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Aucun fichier reçu.' });
    const publicHost = process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get('host')}`;
    const url = `${publicHost}/uploads/chat/${req.file.filename}`;
    return res.status(201).json({ success: true, file: { url, name: req.file.originalname } });
  } catch (e) {
    logger.error('uploadSupport error:', e);
    return res.status(500).json({ success: false, message: "Erreur lors de l'upload" });
  }
};

// GET /api/discussions
exports.list = async (req, res) => {
  try {
    const u = req.user;
    let discussions;
    if (isProf(u)) {
      discussions = await Discussion.find({ professeur_id: u.id }).sort({ last_message_at: -1 }).lean();
    } else if (isResponsable(u)) {
      discussions = await Discussion.find({ filiere_id: u.filiere_id }).sort({ last_message_at: -1 }).lean();
    } else {
      return res.status(403).json({ success: false, message: 'Accès réservé aux professeurs et responsables de classe.' });
    }
    const withUnread = discussions.map((d) => ({
      ...d,
      unread: isProf(u) ? d.unread_professeur : d.unread_responsable,
    }));
    res.json({ success: true, discussions: withUnread });
  } catch (e) {
    logger.error('list discussions error:', e);
    res.status(500).json({ success: false, message: 'Erreur lors du chargement des discussions' });
  }
};

// GET /api/discussions/:id/messages
exports.getMessages = async (req, res) => {
  try {
    const u = req.user;
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) return res.status(404).json({ success: false, message: 'Discussion introuvable' });
    if (!canAccess(u, discussion)) return res.status(403).json({ success: false, message: 'Non autorisé' });

    const messages = await DiscussionMessage.find({ discussion_id: discussion._id }).sort({ createdAt: 1 }).lean();

    // Le côté qui lit remet son compteur de non-lus à zéro
    if (isProf(u)) discussion.unread_professeur = 0;
    else discussion.unread_responsable = 0;
    await discussion.save();

    res.json({ success: true, discussion, messages });
  } catch (e) {
    logger.error('getMessages error:', e);
    res.status(500).json({ success: false, message: 'Erreur lors du chargement des messages' });
  }
};

// POST /api/discussions  (prof → envoie à une classe : crée/continue le fil)
exports.sendToClasse = async (req, res) => {
  try {
    const u = req.user;
    if (!isProf(u)) return res.status(403).json({ success: false, message: 'Réservé aux professeurs.' });

    const { filiere_id, content = '', type = 'text', file_url = null, file_name = null } = req.body;
    if (!filiere_id || (!String(content).trim() && !file_url)) {
      return res.status(400).json({ success: false, message: 'filiere_id et (message ou fichier) sont requis.' });
    }

    const info = await getFiliereInfo(filiere_id);
    if (!info) return res.status(404).json({ success: false, message: 'Filière introuvable.' });
    if (u.departement_id && Number(info.departement_id) !== Number(u.departement_id)) {
      return res.status(403).json({ success: false, message: "Cette classe n'est pas dans votre département." });
    }

    const senderInfo = { nom: u.nom, prenom: u.prenom };
    const discussion = await Discussion.findOneAndUpdate(
      { professeur_id: u.id, filiere_id: Number(filiere_id) },
      {
        $setOnInsert: {
          professeur_id: u.id,
          filiere_id: Number(filiere_id),
          professeur_info: senderInfo,
          filiere_nom: info.nom,
          departement_id: info.departement_id,
          sujet: `Discussion — ${info.nom}`,
        },
      },
      { upsert: true, new: true }
    );

    const message = await DiscussionMessage.create({
      discussion_id: discussion._id,
      sender_id: u.id,
      sender_type: 'professeur',
      sender_info: senderInfo,
      content: String(content).trim() || (file_name ? `Support : ${file_name}` : ''),
      type: file_url ? 'file' : 'text',
      file_url,
      file_name,
    });

    discussion.last_message = message.content;
    discussion.last_message_at = new Date();
    discussion.unread_responsable += 1;
    await discussion.save();

    const io = req.app.get('io');
    if (io) io.to(`discussion_${discussion._id}`).emit('new-discussion-message', { discussion_id: discussion._id, message });
    await notifyResponsables(io, filiere_id, discussion, message, u);

    res.status(201).json({ success: true, discussion, message });
  } catch (e) {
    logger.error('sendToClasse error:', e);
    res.status(500).json({ success: false, message: "Erreur lors de l'envoi" });
  }
};

// POST /api/discussions/:id/messages  (prof OU responsable répond)
exports.reply = async (req, res) => {
  try {
    const u = req.user;
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) return res.status(404).json({ success: false, message: 'Discussion introuvable' });
    if (!canAccess(u, discussion)) return res.status(403).json({ success: false, message: 'Non autorisé' });

    const { content = '', type = 'text', file_url = null, file_name = null } = req.body;
    if (!String(content).trim() && !file_url) {
      return res.status(400).json({ success: false, message: 'Message ou fichier requis.' });
    }

    const senderInfo = { nom: u.nom, prenom: u.prenom };
    const message = await DiscussionMessage.create({
      discussion_id: discussion._id,
      sender_id: u.id,
      sender_type: senderTypeFromRole(u.role),
      sender_info: senderInfo,
      content: String(content).trim() || (file_name ? `Fichier : ${file_name}` : ''),
      type: file_url ? 'file' : 'text',
      file_url,
      file_name,
    });

    discussion.last_message = message.content;
    discussion.last_message_at = new Date();
    if (isProf(u)) discussion.unread_responsable += 1;
    else discussion.unread_professeur += 1;
    await discussion.save();

    const io = req.app.get('io');
    if (io) io.to(`discussion_${discussion._id}`).emit('new-discussion-message', { discussion_id: discussion._id, message });

    // Le prof qui écrit notifie les responsables ; l'inverse passe par la salle temps réel.
    if (isProf(u)) await notifyResponsables(io, discussion.filiere_id, discussion, message, u);

    res.status(201).json({ success: true, message });
  } catch (e) {
    logger.error('reply error:', e);
    res.status(500).json({ success: false, message: "Erreur lors de l'envoi" });
  }
};
