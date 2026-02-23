import {
    getSessions,
    createSession,
    joinSession,
    rateSession,
} from '../api/sessions';

import {
    getSessionMessages,
    getSessionParticipants,
    getMentionSuggestions,
    getWhiteboardState,
    uploadChatFile,
} from '../api/chat';

import {
    getMessages,
    getConversations,
    sendMessage,
    markMessageAsRead,
    getUnreadCount,
} from '../api/messages';

import {
    getNotifications,
    getNotificationUnreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    createNotification,
    deleteNotification,
} from '../api/notifications';

/**
 * Facade de services Node.js (REST) — chat/sessions/messages/notifications.
 * But: offrir un point d'entrée unique côté pages/components.
 */
export const realtimeService = {
    // Sessions
    getSessions,
    createSession,
    joinSession,
    rateSession,

    // Chat session
    getSessionMessages,
    getSessionParticipants,
    getMentionSuggestions,
    getWhiteboardState,
    uploadChatFile,

    // Messages privés
    getMessages,
    getConversations,
    sendMessage,
    markMessageAsRead,
    getUnreadCount,

    // Notifications
    getNotifications,
    getNotificationUnreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    createNotification,
    deleteNotification,
};
