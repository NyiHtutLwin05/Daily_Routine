import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PomodoroSettings, PomodoroSession } from '../types/pomodoro';

interface PomodoroState {
  settings: PomodoroSettings;
  currentSession: PomodoroSession | null;
  sessions: PomodoroSession[];
  isActive: boolean;
  timeRemaining: number; // in seconds
  currentMode: 'work' | 'shortBreak' | 'longBreak';
  completedPomodoros: number;
  
  fetchSettings: () => Promise<void>;
  updateSettings: (settings: Partial<PomodoroSettings>) => Promise<void>;
  startSession: (taskId?: string) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  stopSession: () => void;
  completePomodoro: () => void;
  switchMode: (mode: 'work' | 'shortBreak' | 'longBreak') => void;
  tick: () => void;
  resetTimer: () => void;
}

const DEFAULT_SETTINGS: PomodoroSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLongBreak: 4
};

export const usePomodoroStore = create<PomodoroState>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  currentSession: null,
  sessions: [],
  isActive: false,
  timeRemaining: DEFAULT_SETTINGS.workDuration * 60, // convert to seconds
  currentMode: 'work',
  completedPomodoros: 0,
  
  fetchSettings: async () => {
    try {
      const settingsJson = await AsyncStorage.getItem('pomodoroSettings');
      if (settingsJson) {
        const settings = JSON.parse(settingsJson);
        set({ 
          settings,
          timeRemaining: settings.workDuration * 60
        });
      }
    } catch (error) {
      console.error("Failed to fetch pomodoro settings:", error);
    }
  },
  
  updateSettings: async (newSettings) => {
    try {
      const currentSettings = get().settings;
      const updatedSettings = { ...currentSettings, ...newSettings };
      await AsyncStorage.setItem('pomodoroSettings', JSON.stringify(updatedSettings));
      set({ settings: updatedSettings });
      
      // If we're not in an active session, also update the timer
      if (!get().isActive) {
        const { currentMode } = get();
        let newTimeRemaining;
        
        if (currentMode === 'work') {
          newTimeRemaining = updatedSettings.workDuration * 60;
        } else if (currentMode === 'shortBreak') {
          newTimeRemaining = updatedSettings.shortBreakDuration * 60;
        } else {
          newTimeRemaining = updatedSettings.longBreakDuration * 60;
        }
        
        set({ timeRemaining: newTimeRemaining });
      }
    } catch (error) {
      console.error("Failed to update pomodoro settings:", error);
    }
  },
  
  startSession: (taskId) => {
    const newSession: PomodoroSession = {
      id: Date.now().toString(),
      taskId,
      startTime: new Date().toISOString(),
      endTime: '', // Will be set when session ends
      completed: false,
      totalWorkTime: 0,
      totalBreakTime: 0,
      completedPomodoros: 0
    };
    
    set({ 
      currentSession: newSession,
      isActive: true,
      currentMode: 'work',
      timeRemaining: get().settings.workDuration * 60,
      completedPomodoros: 0
    });
  },
  
  pauseSession: () => {
    set({ isActive: false });
  },
  
  resumeSession: () => {
    set({ isActive: true });
  },
  
  stopSession: () => {
    const { currentSession, completedPomodoros } = get();
    
    if (currentSession) {
      const completedSession: PomodoroSession = {
        ...currentSession,
        endTime: new Date().toISOString(),
        completed: true,
        completedPomodoros
      };
      
      const { sessions } = get();
      const updatedSessions = [...sessions, completedSession];
      
      // Save to AsyncStorage
      AsyncStorage.setItem('pomodoroSessions', JSON.stringify(updatedSessions))
        .catch(error => console.error("Failed to save pomodoro session:", error));
      
      set({ 
        sessions: updatedSessions,
        currentSession: null,
        isActive: false,
        completedPomodoros: 0
      });
    }
  },
  
  completePomodoro: () => {
    const { completedPomodoros, settings } = get();
    const newCompletedPomodoros = completedPomodoros + 1;
    
    // Determine if we should take a long break
    let nextMode: 'shortBreak' | 'longBreak';
    if (newCompletedPomodoros % settings.sessionsBeforeLongBreak === 0) {
      nextMode = 'longBreak';
    } else {
      nextMode = 'shortBreak';
    }
    
    set({ 
      completedPomodoros: newCompletedPomodoros,
      currentMode: nextMode,
      timeRemaining: nextMode === 'longBreak' 
        ? settings.longBreakDuration * 60 
        : settings.shortBreakDuration * 60
    });
  },
  
  switchMode: (mode) => {
    const { settings } = get();
    let newTimeRemaining;
    
    if (mode === 'work') {
      newTimeRemaining = settings.workDuration * 60;
    } else if (mode === 'shortBreak') {
      newTimeRemaining = settings.shortBreakDuration * 60;
    } else {
      newTimeRemaining = settings.longBreakDuration * 60;
    }
    
    set({ 
      currentMode: mode,
      timeRemaining: newTimeRemaining
    });
  },
  
  tick: () => {
    const { timeRemaining, currentMode, isActive } = get();
    
    if (!isActive) return;
    
    if (timeRemaining > 0) {
      set({ timeRemaining: timeRemaining - 1 });
    } else {
      // Timer finished
      if (currentMode === 'work') {
        get().completePomodoro();
      } else {
        set({ 
          currentMode: 'work',
          timeRemaining: get().settings.workDuration * 60
        });
      }
    }
  },
  
  resetTimer: () => {
    const { settings, currentMode } = get();
    let newTimeRemaining;
    
    if (currentMode === 'work') {
      newTimeRemaining = settings.workDuration * 60;
    } else if (currentMode === 'shortBreak') {
      newTimeRemaining = settings.shortBreakDuration * 60;
    } else {
      newTimeRemaining = settings.longBreakDuration * 60;
    }
    
    set({ timeRemaining: newTimeRemaining });
  }
}));