export const PATHS = {
    AUTH: {
        LOGIN: '/login',
        REGISTER: '/register',
        FORGOT_PASSWORD: '/forgot-password',
        GOOGLE_CALLBACK: '/auth/callback/google',
    },
    CUSTOMER: {
        ROOT: '/customer',
        HOME: '/customer/home',
        DISCOVER: '/customer/discover',
        PROFILE: '/customer/profile',
        POST: (id: string) => `/customer/post/${id}`,
        POST_DETAIL: '/customer/post/:id', // For route definition
        WRITE_REVIEW: '/customer/write-review',
    },
    MERCHANT: {
        ROOT: '/merchant',
        LOGIN: '/merchant/login',
        DASHBOARD: '/merchant/dashboard',
        ADS: '/merchant/ads',
        PROFILE: '/merchant/profile',
        MESSAGES: '/merchant/messages',
        CHAT_DETAIL: '/merchant/messages/:chatId',
        CHAT: (chatId: string) => `/merchant/messages/${chatId}`,
        CHAT_SEARCH: '/merchant/messages/:chatId/search',
        SEARCH_MESSAGES: (chatId: string) => `/merchant/messages/${chatId}/search`,
        NOTIFICATIONS: '/merchant/notifications',
    }
};
