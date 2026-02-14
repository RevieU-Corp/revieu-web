// Central configuration file
// Access this in your components using: import { config } from '../config'; (adjust path as needed)

const API_PREFIX = '/api/v1';

function joinUrl(base: string, path: string): string {
  return `${base.replace(/\/+$/, '')}${path}`;
}

const rawApiBase = (import.meta.env.VITE_API_BASE_URL ?? '').trim();

export const config = {
  // Prefer build-time override for local dev (e.g. .env.local).
  // In deployed environments, default to same-origin so dev/prod can share the same build.
  apiBaseUrl: rawApiBase ? joinUrl(rawApiBase, API_PREFIX) : API_PREFIX,
};
