export interface PomodoroSettings {
  workDuration: number; // in minutes
  shortBreakDuration: number; // in minutes
  longBreakDuration: number; // in minutes
  sessionsBeforeLongBreak: number;
}

export interface PomodoroSession {
  id: string;
  taskId?: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  completed: boolean;
  totalWorkTime: number; // in minutes
  totalBreakTime: number; // in minutes
  completedPomodoros: number;
}