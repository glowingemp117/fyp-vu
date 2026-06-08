export const BASE_URL = __DEV__
  ? 'http://localhost:5001/api'
  : 'https://your-production-api.com/api';

export const API_ENDPOINTS = {
  auth: {
    signup: '/auth/signup',
    login: '/auth/login',
    guestLogin: '/auth/guest-login',
    logout: '/auth/logout',
    refreshToken: '/auth/refresh-token',
    forgotPassword: '/auth/forgot-password',
    verifyOtpEmail: '/auth/verify-otp',
    resetPassword: '/auth/reset-password',
    changePassword: '/auth/change-password',
    socialLogin: '/auth/social-login',
    deleteAccount: '/auth/delete-account',
    me: '/users/me',
    updateProfile: '/users/me',
    loginUserBySocialId: '/auth/social-login',
    guestLoginUser: '/auth/guest-login',
  },
  bonds: {
    list: '/bonds',
    add: '/bonds',
    check: '/bonds/check',
    autoCheck: '/bonds/auto-check',
    stats: '/bonds/stats',
    delete: id => `/bonds/${id}`,
  },
  draws: {
    list: '/draws',
    latest: '/draws/latest',
    upcoming: '/draws/upcoming',
    schedule: '/draws/schedule',
    search: '/draws/search',
    detail: id => `/draws/${id}`,
  },
  marketplace: {
    list: '/marketplace',
    create: '/marketplace',
    myListings: '/marketplace/my-listings',
    detail: id => `/marketplace/${id}`,
    update: id => `/marketplace/${id}`,
    delete: id => `/marketplace/${id}`,
  },
  notifications: {
    list: '/notifications',
    markRead: id => `/notifications/${id}/read`,
    markAllRead: '/notifications/read-all',
    delete: id => `/notifications/${id}`,
  },
  users: {
    updateFcmToken: '/users/fcm-token',
  },
};
