import axios from 'axios';
import { config } from '../config';

export const apiClient = axios.create({
    baseURL: config.apiBaseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor for consistent error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Shared error handling logic can go here
        return Promise.reject(error);
    }
);
