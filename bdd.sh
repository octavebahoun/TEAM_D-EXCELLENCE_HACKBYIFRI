#!/bin/bash

# ============================================
# 🍃 MODÈLES MONGODB (Node.js) - 7 COLLECTIONS
# ============================================
# Données temps réel et flexibles

set -e

echo "🍃 Création des modèles MongoDB (Mongoose)..."
echo ""

cd backend/node

# Créer le dossier models s'il n'existe pas
mkdir -p src/models

# ============================================
# 1. SESSION COLLABORATIVE
# ============================================
echo "📝 Création modèle: SessionCollaborative..."
cat > src/models/SessionCollaborative.js << 'EOF'
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
EOF

# ============================================
# 2. SESSION PARTICIPANT
# ============================================
echo "📝 Création modèle: SessionParticipant..."
cat > src/models/SessionParticipant.js << 'EOF'
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
EOF

# ============================================
# 3. CHAT ROOM
# ============================================
echo "📝 Création modèle: ChatRoom..."
cat > src/models/ChatRoom.js << 'EOF'
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
EOF

# ============================================
# 4. MESSAGE
# ============================================
echo "📝 Création modèle: Message..."
cat > src/models/Message.js << 'EOF'
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
EOF

# ============================================
# 5. NOTIFICATION
# ============================================
echo "📝 Création modèle: Notification..."
cat > src/models/Notification.js << 'EOF'
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user_id: {
    type: Number, // ID depuis MySQL
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['info', 'rappel', 'alerte', 'succes', 'badge', 'session', 'message'],
    required: true
  },
  titre: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  action_url: {
    type: String,
    default: null
  },
  data: {
    type: mongoose.Schema.Types.Mixed, // Données additionnelles flexibles
    default: {}
  },
  is_read: {
    type: Boolean,
    default: false
  },
  read_at: {
    type: Date,
    default: null
  },
  expires_at: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  collection: 'notifications'
});

// Index pour performance
notificationSchema.index({ user_id: 1, is_read: 1, createdAt: -1 });
notificationSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 }); // TTL index

module.exports = mongoose.model('Notification', notificationSchema);
EOF

# ============================================
# 6. SESSION EVENT
# ============================================
echo "📝 Création modèle: SessionEvent..."
cat > src/models/SessionEvent.js << 'EOF'
const mongoose = require('mongoose');

const sessionEventSchema = new mongoose.Schema({
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
    prenom: String
  },
  event_type: {
    type: String,
    enum: ['joined', 'left', 'kicked', 'promoted', 'muted'],
    required: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true,
  collection: 'session_events'
});

// Index pour historique
sessionEventSchema.index({ session_id: 1, createdAt: -1 });
sessionEventSchema.index({ user_id: 1 });

module.exports = mongoose.model('SessionEvent', sessionEventSchema);
EOF

# ============================================
# 7. ONLINE USER
# ============================================
echo "📝 Création modèle: OnlineUser..."
cat > src/models/OnlineUser.js << 'EOF'
const mongoose = require('mongoose');

const onlineUserSchema = new mongoose.Schema({
  user_id: {
    type: Number, // ID depuis MySQL
    required: true,
    unique: true
  },
  user_info: {
    nom: String,
    prenom: String,
    avatar_url: String
  },
  socket_id: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['online', 'away', 'busy'],
    default: 'online'
  },
  current_session_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SessionCollaborative',
    default: null
  },
  last_activity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'online_users'
});

// Index
onlineUserSchema.index({ socket_id: 1 });
onlineUserSchema.index({ status: 1 });
onlineUserSchema.index({ last_activity: -1 });

// TTL: Suppression auto après 5 min d'inactivité
onlineUserSchema.index({ last_activity: 1 }, { expireAfterSeconds: 300 });

module.exports = mongoose.model('OnlineUser', onlineUserSchema);
EOF

echo ""
echo "✅ 7 modèles MongoDB créés!"
echo ""
echo "📁 Fichiers créés dans: backend/node/src/models/"
echo "   - SessionCollaborative.js"
echo "   - SessionParticipant.js"
echo "   - ChatRoom.js"
echo "   - Message.js"
echo "   - Notification.js"
echo "   - SessionEvent.js"
echo "   - OnlineUser.js"
echo ""
echo "🚀 Prochaines étapes:"
echo "   1. Configure MongoDB Atlas"
echo "   2. Ajoute la connection string dans .env"
echo "   3. npm install mongoose"
echo ""