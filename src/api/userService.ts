import { apiClient } from './apiClient';

export interface UserProfileResponse {
    user_id: number;
    nickname: string;
    avatar_url: string;
    intro: string;
    location: string;
}

export const userService = {
    // Get user profile
    getProfile: () => apiClient.get<UserProfileResponse>('/user/profile'),

    // Update user profile
    updateProfile: (data: Partial<UserProfileResponse>) =>
        apiClient.put('/user/profile', data),
};
