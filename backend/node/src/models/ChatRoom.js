const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
  session_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SessionCollaborative',
    required: true,
    unique: true
  },
  room_name: {
    type: String,
    required: true
  },
  active_users: [{
    user_id: Number,
    nom: String,
    prenom: String,
    avatar_url: String,
    joined_at: Date
  }],
  last_activity: {
    type: Date,
    default: Date.now
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'chat_rooms'
});

chatRoomSchema.index({ session_id: 1 });
chatRoomSchema.index({ is_active: 1, last_activity: -1 });

module.exports = mongoose.model('ChatRoom', chatRoomSchema);
