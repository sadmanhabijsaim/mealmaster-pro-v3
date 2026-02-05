
export interface Member {
  id: string;
  name: string;
  joinDate: string;
}

export type MealTime = 'Sokal' | 'Dupur' | 'Rat';

export interface MealRecord {
  id: string;
  date: string;
  memberId: string;
  sokal: number;
  dupur: number;
  rat: number;
}

export interface BazaarRecord {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'Bazaar' | 'Deposit';
  memberId: string;
}

export interface Profile {
  managerName: string;
  messName: string;
  avatarUrl: string;
  visualTheme?: 'default' | 'food' | 'nature' | 'sunset';
}

export interface User {
  id: string;
  email: string;
  phone?: string;
  password?: string;
}

export type ThemeMode = 'light' | 'dark';

export interface AppState {
  members: Member[];
  meals: MealRecord[];
  bazaar: BazaarRecord[];
  scriptUrl: string;
  profile: Profile;
  user: User | null;
  theme: ThemeMode;
}
