const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  chat_room_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatRoom',
    required: true,
    index: true
  },
  session_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SessionCollaborative',
    required: true,
    index: true
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
  type: {
    type: String,
    enum: ['text', 'system', 'file', 'image'],
    default: 'text'
  },
  contenu: {
    type: String,
    required: true
  },
  file_url: {
    type: String,
    default: null
  },
  is_edited: {
    type: Boolean,
    default: false
  },
  edited_at: {
    type: Date,
    default: null
  },
  is_deleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  collection: 'messages'
});

// Index pour performance
messageSchema.index({ chat_room_id: 1, createdAt: -1 });
messageSchema.index({ session_id: 1, createdAt: -1 });
messageSchema.index({ user_id: 1 });

module.exports = mongoose.model('Message', messageSchema);
