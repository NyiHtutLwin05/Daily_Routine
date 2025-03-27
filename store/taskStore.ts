import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, TaskCategory, TaskPriority, RecurrenceType } from '../types/task';

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Task>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskCompletion: (id: string) => Promise<void>;
  getTaskById: (id: string) => Task | undefined;
  getTasksByDate: (date: string) => Task[];
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const tasksJson = await AsyncStorage.getItem('tasks');
      const tasks = tasksJson ? JSON.parse(tasksJson) : [];
      set({ tasks, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch tasks", isLoading: false });
    }
  },

  addTask: async (taskData) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const { tasks } = get();
      const updatedTasks = [...tasks, newTask];
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      set({ tasks: updatedTasks });
      return newTask;
    } catch (error) {
      set({ error: "Failed to add task" });
      throw error;
    }
  },

  updateTask: async (id, updates) => {
    try {
      const { tasks } = get();
      const updatedTasks = tasks.map(task => 
        task.id === id 
          ? { ...task, ...updates, updatedAt: new Date().toISOString() } 
          : task
      );
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      set({ tasks: updatedTasks });
    } catch (error) {
      set({ error: "Failed to update task" });
      throw error;
    }
  },

  deleteTask: async (id) => {
    try {
      const { tasks } = get();
      const updatedTasks = tasks.filter(task => task.id !== id);
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      set({ tasks: updatedTasks });
    } catch (error) {
      set({ error: "Failed to delete task" });
      throw error;
    }
  },

  toggleTaskCompletion: async (id) => {
    try {
      const { tasks } = get();
      const taskToUpdate = tasks.find(task => task.id === id);
      
      if (!taskToUpdate) return;
      
      const updatedTasks = tasks.map(task => 
        task.id === id 
          ? { 
              ...task, 
              completed: !task.completed, 
              updatedAt: new Date().toISOString(),
              streak: task.recurrence !== 'none' && !task.completed 
                ? (task.streak || 0) + 1 
                : task.streak
            } 
          : task
      );
      
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      set({ tasks: updatedTasks });
    } catch (error) {
      set({ error: "Failed to toggle task completion" });
      throw error;
    }
  },

  getTaskById: (id) => {
    return get().tasks.find(task => task.id === id);
  },

  getTasksByDate: (date) => {
    return get().tasks.filter(task => {
      // Check if the task is for the given date
      return task.date === date;
    });
  }
}));