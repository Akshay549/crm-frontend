// Keeps the logged-in user's display info (name, role) for the header.
// The real login state is the httpOnly sessionId cookie, not this.
export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

const KEY = "estateflow_user";
const CHANGE_EVENT = "estateflow-auth-change";

function notify() {
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function saveUser(user: AuthUser) {
  localStorage.setItem(KEY, JSON.stringify(user));
  notify();
}

export function clearUser() {
  localStorage.removeItem(KEY);
  notify();
}

// Used with useSyncExternalStore in AppShell
export function subscribeUser(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function getStoredUser(): string | null {
  return localStorage.getItem(KEY);
}

export function parseUser(raw: string | null): AuthUser | null {
  try {
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}
