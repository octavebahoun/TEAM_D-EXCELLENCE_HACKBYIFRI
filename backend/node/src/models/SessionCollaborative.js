const mongoose = require('mongoose');

const sessionCollaborativeSchema = new mongoose.Schema({
  organisateur_id: {
    type: Number, // ID depuis MySQL
    required: true,
    index: true
  },
  matiere_id: {
    type: Number, // ID depuis MySQL
    default: null
  },
  titre: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: null
  },
  date_debut: {
    type: Date,
    required: true
  },
  date_fin: {
    type: Date,
    default: null
  },
  format: {
    type: String,
    enum: ['en_ligne', 'presentiel'],
    default: 'en_ligne'
  },
  lien_visio: {
    type: String,
    default: null
  },
  lieu: {
    type: String,
    default: null
  },
  nb_max_participants: {
    type: Number,
    default: 10
  },
  niveau_requis: {
    type: String,
    enum: ['debutant', 'intermediaire', 'avance'],
    default: 'intermediaire'
  },
  statut: {
    type: String,
    enum: ['planifiee', 'en_cours', 'terminee', 'annulee'],
    default: 'planifiee'
  },
  room_id: {
    type: String, // ID Socket.io room
    unique: true
  }
}, {
  timestamps: true,
  collection: 'sessions_collaboratives'
});

// Index pour recherche
sessionCollaborativeSchema.index({ date_debut: 1, statut: 1 });
sessionCollaborativeSchema.index({ organisateur_id: 1 });
sessionCollaborativeSchema.index({ matiere_id: 1 });

module.exports = mongoose.model('SessionCollaborative', sessionCollaborativeSchema);
