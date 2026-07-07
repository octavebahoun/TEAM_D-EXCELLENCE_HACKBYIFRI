/**
 * @file discussions.js
 * @description Routes REST des discussions Prof ↔ Responsable de classe.
 */

const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/discussionController');
const auth = require('../middleware/auth');

// Authentification requise (prof ou responsable)
router.use(auth);

router.get('/', ctrl.list);                      // mes discussions
router.post('/', ctrl.sendToClasse);             // prof → envoie à une classe (crée/continue le fil)
router.get('/:id/messages', ctrl.getMessages);   // messages d'un fil
router.post('/:id/messages', ctrl.reply);        // répondre dans un fil

module.exports = router;
