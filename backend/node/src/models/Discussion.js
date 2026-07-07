/**
 * @file Discussion.js
 * @description Fil de discussion Prof ↔ Responsable(s) d'une classe (filière).
 * Un fil unique par couple (professeur, filière) : le prof y envoie ses supports
 * et informations, le(s) responsable(s) de la classe y répondent.
 */

const mongoose = require('mongoose');

const discussionSchema = new mongoose.Schema({
  professeur_id: { type: Number, required: true, index: true }, // id table `enseignants`
  professeur_info: {
    nom: String,
    prenom: String,
  },
  filiere_id: { type: Number, required: true, index: true }, // id table `filieres`
  filiere_nom: { type: String, default: null },
  departement_id: { type: Number, default: null },
  sujet: { type: String, default: 'Discussion' },
  last_message: { type: String, default: '' },
  last_message_at: { type: Date, default: Date.now },
  unread_professeur: { type: Number, default: 0 },
  unread_responsable: { type: Number, default: 0 },
}, {
  timestamps: true,
  collection: 'discussions',
});

// Un seul fil par couple (professeur, filière)
discussionSchema.index({ professeur_id: 1, filiere_id: 1 }, { unique: true });

module.exports = mongoose.model('Discussion', discussionSchema);
