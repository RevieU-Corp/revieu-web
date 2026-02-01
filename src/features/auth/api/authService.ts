import { apiClient } from '../../../api/apiClient';
import { config } from '../../../config';

const BASE_PATH = '/auth';

export const authService = {
    login: (credentials: any) =>
        apiClient.post(`${BASE_PATH}/login`, credentials),

    register: (data: any) =>
        apiClient.post(`${BASE_PATH}/register`, data),

    forgotPassword: (email: string) =>
        apiClient.post(`${BASE_PATH}/forgot-password`, { email }),

    getGoogleLoginUrl: () =>
        `${config.apiBaseUrl}${BASE_PATH}/login/google`,

    getMe: () =>
        apiClient.get(`${BASE_PATH}/me`),

    getUserProfile: () =>
        apiClient.get('/user/profile'),
};
