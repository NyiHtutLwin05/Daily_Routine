import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit, HabitLog } from '../types/habit';

interface HabitState {
  habits: Habit[];
  isLoading: boolean;
  error: string | null;
  fetchHabits: () => Promise<void>;
  addHabit: (habit: Omit<Habit, 'id' | 'currentStreak' | 'longestStreak' | 'logs' | 'createdAt'>) => Promise<Habit>;
  updateHabit: (id: string, updates: Partial<Habit>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  logHabitCompletion: (id: string, date: string, completed: boolean) => Promise<void>;
  getHabitById: (id: string) => Habit | undefined;
}

export const useHabitStore = create<HabitState>((set, get) => ({
  habits: [],
  isLoading: false,
  error: null,

  fetchHabits: async () => {
    set({ isLoading: true, error: null });
    try {
      const habitsJson = await AsyncStorage.getItem('habits');
      const habits = habitsJson ? JSON.parse(habitsJson) : [];
      set({ habits, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch habits", isLoading: false });
    }
  },

  addHabit: async (habitData) => {
    const newHabit: Habit = {
      ...habitData,
      id: Date.now().toString(),
      currentStreak: 0,
      longestStreak: 0,
      logs: [],
      createdAt: new Date().toISOString(),
    };

    try {
      const { habits } = get();
      const updatedHabits = [...habits, newHabit];
      await AsyncStorage.setItem('habits', JSON.stringify(updatedHabits));
      set({ habits: updatedHabits });
      return newHabit;
    } catch (error) {
      set({ error: "Failed to add habit" });
      throw error;
    }
  },

  updateHabit: async (id, updates) => {
    try {
      const { habits } = get();
      const updatedHabits = habits.map(habit => 
        habit.id === id ? { ...habit, ...updates } : habit
      );
      await AsyncStorage.setItem('habits', JSON.stringify(updatedHabits));
      set({ habits: updatedHabits });
    } catch (error) {
      set({ error: "Failed to update habit" });
      throw error;
    }
  },

  deleteHabit: async (id) => {
    try {
      const { habits } = get();
      const updatedHabits = habits.filter(habit => habit.id !== id);
      await AsyncStorage.setItem('habits', JSON.stringify(updatedHabits));
      set({ habits: updatedHabits });
    } catch (error) {
      set({ error: "Failed to delete habit" });
      throw error;
    }
  },

  logHabitCompletion: async (id, date, completed) => {
    try {
      const { habits } = get();
      const habitIndex = habits.findIndex(habit => habit.id === id);
      
      if (habitIndex === -1) return;
      
      const habit = habits[habitIndex];
      const logIndex = habit.logs.findIndex(log => log.date === date);
      
      let logs: HabitLog[];
      if (logIndex >= 0) {
        logs = [...habit.logs];
        logs[logIndex] = { date, completed };
      } else {
        logs = [...habit.logs, { date, completed }];
      }
      
      // Calculate streak
      let currentStreak = habit.currentStreak;
      if (completed) {
        currentStreak += 1;
      } else {
        currentStreak = 0;
      }
      
      const longestStreak = Math.max(habit.longestStreak, currentStreak);
      
      const updatedHabit = {
        ...habit,
        logs,
        currentStreak,
        longestStreak
      };
      
      const updatedHabits = [...habits];
      updatedHabits[habitIndex] = updatedHabit;
      
      await AsyncStorage.setItem('habits', JSON.stringify(updatedHabits));
      set({ habits: updatedHabits });
    } catch (error) {
      set({ error: "Failed to log habit completion" });
      throw error;
    }
  },

  getHabitById: (id) => {
    return get().habits.find(habit => habit.id === id);
  }
}));