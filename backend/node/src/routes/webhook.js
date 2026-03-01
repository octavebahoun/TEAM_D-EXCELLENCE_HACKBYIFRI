/**
 * @file webhook.js
 * @description Route webhook interne : reçoit les alertes créées par Laravel
 * et les diffuse en temps réel via Socket.io à l'étudiant concerné.
 *
 * Sécurité : le header x-webhook-secret doit correspondre à la variable
 * d'environnement WEBHOOK_SECRET (partagée entre Laravel et Node.js).
 */

const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const logger = require('../utils/logger');

/**
 * Correspondance entre les types d'alerte Laravel et les types de notification Node.js.
 * Le modèle Notification MongoDB accepte : info | rappel | alerte | succes | badge | session | message | mention
 */
const ALERTE_TYPE_MAP = {
    note_faible: 'alerte',
    moyenne_faible: 'alerte',
    deadline_proche: 'rappel',
    absence: 'alerte',
};

/**
 * POST /api/webhook/alerte
 *
 * Body attendu (envoyé par Laravel AlerteObserver) :
 * {
 *   user_id:         number,
 *   type_alerte:     "note_faible" | "moyenne_faible" | "deadline_proche" | "absence",
 *   niveau_severite: "faible" | "moyen" | "eleve",
 *   titre:           string,
 *   message:         string,
 *   alerte_id:       number,
 *   actions_suggerees: array | null
 * }
 */
router.post('/alerte', async (req, res) => {
    // ── Vérification du secret partagé ──────────────────────────────────────────
    const secret = process.env.WEBHOOK_SECRET;
    if (secret && req.headers['x-webhook-secret'] !== secret) {
        logger.warn('Webhook alerte : secret invalide');
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { user_id, type_alerte, niveau_severite, titre, message, alerte_id, actions_suggerees } = req.body;

    if (!user_id || !titre || !message) {
        return res.status(400).json({ success: false, message: 'user_id, titre et message sont requis' });
    }

    try {
        // ── Créer la notification dans MongoDB ──────────────────────────────────
        const notificationType = ALERTE_TYPE_MAP[type_alerte] || 'alerte';

        const notification = await Notification.create({
            user_id: Number(user_id),
            type: notificationType,
            titre,
            message,
            data: {
                alerte_id: alerte_id || null,
                type_alerte: type_alerte || null,
                niveau_severite: niveau_severite || 'moyen',
                actions_suggerees: actions_suggerees || [],
            },
            is_read: false,
        });

        // ── Émettre l'événement Socket.io à l'utilisateur en temps réel ─────────
        const io = req.app.get('io');
        if (io) {
            io.to(`user_${user_id}`).emit('notification', notification);
            logger.info(`Notification Socket.io émise → user_${user_id} (alerte: ${type_alerte})`);
        } else {
            logger.warn('Webhook alerte : instance io non disponible');
        }

        return res.status(200).json({ success: true, notification_id: notification._id });
    } catch (error) {
        logger.error('Webhook alerte : erreur lors de la création de notification', error);
        return res.status(500).json({ success: false, message: 'Erreur interne', error: error.message });
    }
});

module.exports = router;
