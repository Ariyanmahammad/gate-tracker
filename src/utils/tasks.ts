import { SEED_TASKS } from '../data/seedSchedule';
import type { AppState, PlannedTask, TaskProgress, TaskStatus } from '../types';

// Combine seed tasks + user edits + custom tasks - deleted tasks = the effective schedule.
export function getEffectiveTasks(state: AppState): PlannedTask[] {
  const deleted = new Set(state.deletedTaskIds);
  const edited = SEED_TASKS.filter((t) => !deleted.has(t.id)).map((t) => {
    const edit = state.editsToSchedule[t.id];
    return edit ? { ...t, ...edit } : t;
  });
  const custom = state.customTasks.filter((t) => !deleted.has(t.id));
  return [...edited, ...custom].sort((a, b) => a.date.localeCompare(b.date) || sessionOrder(a.session) - sessionOrder(b.session));
}

function sessionOrder(s: string): number {
  const order = ['Day', 'Morning', 'Afternoon', 'Evening', 'Night', 'Night/Analysis'];
  const i = order.indexOf(s);
  return i === -1 ? 99 : i;
}

export function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getTasksForDate(tasks: PlannedTask[], date: string): PlannedTask[] {
  return tasks.filter((t) => t.date === date);
}

export const STATUS_LABELS: Record<TaskStatus, string> = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  completed: 'Completed',
  partial: 'Partially Completed',
  skipped: 'Skipped',
};

export function getTaskStatus(state: AppState, taskId: string): TaskStatus {
  return state.progress[taskId]?.status ?? 'not_started';
}

export function getCompletionPct(state: AppState, taskId: string): number {
  const p = state.progress[taskId];
  if (!p) return 0;
  if (p.status === 'completed') return 100;
  if (p.status === 'partial') return p.completionPercentage;
  return 0;
}

export function defaultProgress(taskId: string): TaskProgress {
  const now = new Date().toISOString();
  return {
    taskId,
    status: 'not_started',
    completionPercentage: 0,
    actualStudyMinutes: 0,
    pyqsAttempted: 0,
    pyqsCorrect: 0,
    pyqsWrong: 0,
    pyqsUnattempted: 0,
    revisionDone: false,
    test: { taken: false },
    mistakes: '',
    learned: '',
    notes: '',
    submittedAt: now,
    updatedAt: now,
  };
}
