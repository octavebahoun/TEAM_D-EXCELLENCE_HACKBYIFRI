/**
 * @file discussionSocket.js
 * @description Temps réel des discussions Prof ↔ Responsable.
 * Les participants rejoignent la salle `discussion_<id>` (après contrôle d'accès) ;
 * les nouveaux messages y sont poussés par le contrôleur REST.
 * S'appuie sur le `io` principal (authentifié par socketAuth → socket.user).
 */

const Discussion = require('../models/Discussion');
const logger = require('../utils/logger');

const canAccess = (u, discussion) => {
  if (!u || !discussion) return false;
  if (u.role === 'professeur') return Number(discussion.professeur_id) === Number(u.id);
  if (u.role === 'student' && u.is_responsable) return Number(discussion.filiere_id) === Number(u.filiere_id);
  return false;
};

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('join-discussion', async (discussionId) => {
      try {
        const u = socket.user;
        if (!u || !discussionId) return;

        const discussion = await Discussion.findById(discussionId).lean();
        if (!discussion || !canAccess(u, discussion)) {
          socket.emit('discussion-error', { error: 'Accès refusé à cette discussion' });
          return;
        }

        socket.join(`discussion_${discussionId}`);
        socket.emit('discussion-joined', { discussionId });
      } catch (error) {
        logger.error('join-discussion error:', error);
      }
    });

    socket.on('leave-discussion', (discussionId) => {
      if (discussionId) socket.leave(`discussion_${discussionId}`);
    });
  });
};
