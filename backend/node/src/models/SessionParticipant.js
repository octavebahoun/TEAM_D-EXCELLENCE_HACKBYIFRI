const mongoose = require('mongoose');

const sessionParticipantSchema = new mongoose.Schema({
  session_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SessionCollaborative',
    required: true
  },
  user_id: {
    type: Number, // ID depuis MySQL
    required: true
  },
  user_info: {
    nom: String,
    prenom: String,
    avatar_url: String
  },
  statut: {
    type: String,
    enum: ['inscrit', 'present', 'absent'],
    default: 'inscrit'
  },
  joined_at: {
    type: Date,
    default: null
  },
  left_at: {
    type: Date,
    default: null
  },
  note_donnee: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  commentaire: {
    type: String,
    default: null
  }
}, {
  timestamps: true,
  collection: 'session_participants'
});

// Index composé pour éviter doublons
sessionParticipantSchema.index({ session_id: 1, user_id: 1 }, { unique: true });

module.exports = mongoose.model('SessionParticipant', sessionParticipantSchema);
