export type TaskPriority = "low" | "medium" | "high";

export type TaskCategory = 
  | "work" 
  | "personal" 
  | "health" 
  | "learning" 
  | "social" 
  | "other";

export type RecurrenceType = 
  | "none" 
  | "daily" 
  | "weekdays" 
  | "weekly" 
  | "monthly" 
  | "custom";

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  date: string; // ISO string
  startTime?: string; // HH:MM format
  endTime?: string; // HH:MM format
  priority: TaskPriority;
  category: TaskCategory;
  recurrence: RecurrenceType;
  streak?: number;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}