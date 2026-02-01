// Central configuration file
// Access this in your components using: import { config } from '../config'; (adjust path as needed)

export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL
    ? `${import.meta.env.VITE_API_BASE_URL}/api/v1`
    : 'https://revieu.weijun.online/api/v1',
  // You can add other global constants here in the future
};