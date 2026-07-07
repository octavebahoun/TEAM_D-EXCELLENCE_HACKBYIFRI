/**
 * @file DiscussionMessage.js
 * @description Message d'un fil de discussion Prof ↔ Responsable.
 * Peut être un texte ou un fichier (support de cours).
 * L'expéditeur est identifié par (sender_id + sender_type) car un prof est dans
 * la table `enseignants` et un responsable dans la table `users` (ids qui peuvent
 * se chevaucher) — le type lève l'ambiguïté.
 */

const mongoose = require('mongoose');

const discussionMessageSchema = new mongoose.Schema({
  discussion_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Discussion',
    required: true,
    index: true,
  },
  sender_id: { type: Number, required: true },
  sender_type: {
    type: String,
    enum: ['professeur', 'responsable', 'chef', 'admin'],
    required: true,
  },
  sender_info: {
    nom: String,
    prenom: String,
  },
  content: { type: String, default: '' },
  type: { type: String, enum: ['text', 'file'], default: 'text' },
  file_url: { type: String, default: null },
  file_name: { type: String, default: null },
  read: { type: Boolean, default: false },
}, {
  timestamps: true,
  collection: 'discussion_messages',
});

module.exports = mongoose.model('DiscussionMessage', discussionMessageSchema);
