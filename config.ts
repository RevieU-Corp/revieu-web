
// Central configuration file
// Access this in your components using: import { config } from '../config'; (adjust path as needed)

export const config = {
  // The Backend API URL
  // Falls back to localhost if the .env variable isn't set
  // We use optional chaining (?.) to prevent a crash if import.meta.env is undefined
  apiBaseUrl: (import.meta as any).env?.VITE_API_BASE_URL || 'https://uscre.liweijun.online/api/v1',
  
  // You can add other global constants here in the future
  endpoints: {
    login: '/auth/login',
    register: '/auth/register',
    posts: '/posts'
  }
};
