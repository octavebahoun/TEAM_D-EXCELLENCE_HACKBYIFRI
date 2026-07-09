/**
 * @file discussions.js
 * @description Routes REST des discussions Prof ↔ Responsable de classe.
 */

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const ctrl = require('../controllers/discussionController');
const auth = require('../middleware/auth');

// Upload des supports de cours (réutilise le dossier statique servi sous /uploads/chat)
const uploadBasePath = process.env.UPLOAD_BASE_PATH || path.join(process.cwd(), 'uploads', 'chat');
fs.mkdirSync(uploadBasePath, { recursive: true });
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadBasePath),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '');
    cb(null, `disc-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// Authentification requise (prof ou responsable)
router.use(auth);

router.post('/upload', upload.single('file'), ctrl.uploadSupport); // support de cours
router.get('/', ctrl.list);                      // mes discussions
router.post('/', ctrl.sendToClasse);             // prof → envoie à une classe (crée/continue le fil)
router.get('/:id/messages', ctrl.getMessages);   // messages d'un fil
router.post('/:id/messages', ctrl.reply);        // répondre dans un fil

module.exports = router;
