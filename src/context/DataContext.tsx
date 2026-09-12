import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import type { AppState, ErrorLogEntry, PlannedTask, TaskProgress } from '../types';
import { loadState, saveState } from '../utils/storage';
import { getEffectiveTasks } from '../utils/tasks';

interface DataContextValue {
  state: AppState;
  tasks: PlannedTask[];
  saveProgress: (taskId: string, progress: TaskProgress) => void;
  addErrorLogEntry: (entry: ErrorLogEntry) => void;
  updateErrorLogEntry: (id: string, patch: Partial<ErrorLogEntry>) => void;
  deleteErrorLogEntry: (id: string) => void;
  setWeeklyNote: (weekStart: string, notes: string) => void;
  addCustomTask: (task: PlannedTask) => void;
  editTask: (taskId: string, patch: Partial<PlannedTask>) => void;
  deleteTask: (taskId: string) => void;
  replaceState: (newState: AppState) => void;
  resetAllData: () => void;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState());
  const tasksRef = useRef<PlannedTask[]>(getEffectiveTasks(state));
  tasksRef.current = getEffectiveTasks(state);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const value: DataContextValue = {
    state,
    tasks: tasksRef.current,
    saveProgress: (taskId, progress) =>
      setState((s) => ({ ...s, progress: { ...s.progress, [taskId]: progress } })),
    addErrorLogEntry: (entry) => setState((s) => ({ ...s, errorLog: [entry, ...s.errorLog] })),
    updateErrorLogEntry: (id, patch) =>
      setState((s) => ({
        ...s,
        errorLog: s.errorLog.map((e) => (e.id === id ? { ...e, ...patch } : e)),
      })),
    deleteErrorLogEntry: (id) =>
      setState((s) => ({ ...s, errorLog: s.errorLog.filter((e) => e.id !== id) })),
    setWeeklyNote: (weekStart, notes) =>
      setState((s) => ({ ...s, weeklyNotes: { ...s.weeklyNotes, [weekStart]: { weekStart, notes } } })),
    addCustomTask: (task) => setState((s) => ({ ...s, customTasks: [...s.customTasks, task] })),
    editTask: (taskId, patch) =>
      setState((s) => {
        const isCustom = s.customTasks.some((t) => t.id === taskId);
        if (isCustom) {
          return {
            ...s,
            customTasks: s.customTasks.map((t) => (t.id === taskId ? { ...t, ...patch } : t)),
          };
        }
        return { ...s, editsToSchedule: { ...s.editsToSchedule, [taskId]: { ...s.editsToSchedule[taskId], ...patch } } };
      }),
    deleteTask: (taskId) =>
      setState((s) => ({ ...s, deletedTaskIds: [...s.deletedTaskIds, taskId] })),
    replaceState: (newState) => setState(newState),
    resetAllData: () => {
      if (confirm('This will permanently erase all your submitted progress, error log entries, and schedule edits. Continue?')) {
        localStorage.removeItem('gate2027.appState.v1');
        window.location.reload();
      }
    },
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
