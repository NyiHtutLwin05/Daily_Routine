export interface HabitLog {
  date: string; // ISO date string
  completed: boolean;
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  category: string;
  frequency: number; // Number of times per week
  currentStreak: number;
  longestStreak: number;
  logs: HabitLog[];
  createdAt: string; // ISO string
}