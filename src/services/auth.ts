export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const USERS_KEY = 'map_users';
const SESSION_KEY = 'map_session';

const generateId = () => Math.random().toString(36).substring(2, 10);

const getAvatarColor = (username: string): string => {
  const colors = ['6366f1', '8b5cf6', 'ec4899', 'f43f5e', 'f97316', 'eab308', '22c55e', '06b6d4', '3b82f6'];
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export const getUsers = (): User[] => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
};

export const register = (username: string, email: string, password: string): { success: boolean; error?: string; user?: User } => {
  const users = getUsers();
  
  if (users.find(u => u.email === email)) {
    return { success: false, error: 'Email already registered' };
  }
  if (users.find(u => u.username === username)) {
    return { success: false, error: 'Username already taken' };
  }
  if (password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters' };
  }

  const user: User = {
    id: generateId(),
    username,
    email,
    avatar: `https://ui-avatars.com/api/?name=${username}&background=${getAvatarColor(username)}&color=fff&size=128`,
    createdAt: new Date().toISOString(),
  };

  // Store password hash (simple, not production-grade)
  const usersWithPasswords = [...users, { ...user, password: btoa(password) }];
  localStorage.setItem(USERS_KEY, JSON.stringify(usersWithPasswords));
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));

  return { success: true, user };
};

export const login = (email: string, password: string): { success: boolean; error?: string; user?: User } => {
  const users = getUsers() as (User & { password: string })[];
  const user = users.find(u => u.email === email && u.password === btoa(password));

  if (!user) {
    return { success: false, error: 'Invalid email or password' };
  }

  const { password: _, ...userData } = user;
  localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
  return { success: true, user: userData };
};

export const logout = (): void => {
  localStorage.removeItem(SESSION_KEY);
};

export const getSession = (): User | null => {
  try {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  } catch {
    return null;
  }
};
