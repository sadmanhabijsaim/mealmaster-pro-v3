import { AppState, User } from '../types';

const DEFAULT_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzHNt10SWGlkkc0dXZ6VXq_6FbAn5Rn1MT8JWJ1GhDoIWlBS4ZUi5dFe0bHDIbs_wp5Mg/exec';
const TIMEOUT_MS = 30000;
const IS_DEV = !import.meta.env.PROD;

/**
 * Gets the current configured script URL from localStorage or defaults to the provided one.
 */
export const getScriptUrl = () => {
  return localStorage.getItem('meal_app_custom_script_url') || DEFAULT_SCRIPT_URL;
};

/**
 * Robust fetch for Google Apps Script with redirect handling and timeout.
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), TIMEOUT_MS);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      mode: 'cors',
      redirect: 'follow',
    });
    clearTimeout(id);
    return response;
  } catch (err: any) {
    clearTimeout(id);
    console.error("Fetch Exception Details:", err);
    if (err.name === 'AbortError') {
      throw new Error('Connection timed out. Google Sheets took too long to respond.');
    }
    throw err;
  }
}

export const CloudService = {
  async authenticate(action: 'LOGIN' | 'SIGNUP', payload: any): Promise<User | null> {
    try {
      // Development mode: allow demo login
      if (IS_DEV) {
        const email = String(payload.email || payload.Username || payload.username || '').trim();
        if (email) {
          console.log('DEV MODE: Auto-login as', email);
          return { id: email, email };
        }
      }

      const res = await fetch('/.netlify/functions/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...payload })
      });
      const result = await res.json();
      if (res.ok && result.success) {
        if (result.user) return result.user as User;
        const email = String(payload.email || payload.Username || payload.username || '').trim();
        return email ? { id: email, email } : null;
      }
      throw new Error(result.message || 'Authentication failed');
    } catch (err: any) {
      console.error('AUTH_ERROR', err);
      // Fallback: allow demo access in dev mode
      if (IS_DEV && payload.email) {
        return { id: payload.email, email: payload.email };
      }
      throw err;
    }
  },

  async recoverPassword(email: string): Promise<string> {
    throw new Error('Password recovery is disabled. Contact admin.');
  },

  async fetchData(email: string): Promise<Partial<AppState> | null> {
    try {
      const url = `/.netlify/functions/fetch-data?username=${encodeURIComponent(email)}`;
      const res = await fetch(url, { method: 'GET' });
      if (!res.ok) throw new Error('Failed to fetch data');
      const result = await res.json();
      if (res.ok && result.success) return result.data;
      return null;
    } catch (err: any) {
      console.error('CLOUDFETCH_ERROR', err);
      // In dev/offline mode, just return null (use local state)
      return null;
    }
  },

  async saveData(action: string, email: string, payload: any): Promise<void> {
    try {
      await fetch('/.netlify/functions/save-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, data: payload })
      });
    } catch (err: any) {
      console.error('CLOUDSAVE_ERROR', err);
      // In dev mode, silently fail (data stays in localStorage)
    }
  }
};