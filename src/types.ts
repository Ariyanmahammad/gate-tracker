// ---------- Core schedule (planned) types ----------

export type SessionLabel =
  | 'Day'
  | 'Night'
  | 'Morning'
  | 'Afternoon'
  | 'Evening'
  | 'Night/Analysis';

export type TaskStatus =
  | 'not_started'
  | 'in_progress'
  | 'completed'
  | 'partial'
  | 'skipped';

export interface TestData {
  taken: boolean;
  testName?: string;
  marksObtained?: number;
  totalMarks?: number;
  correct?: number;
  wrong?: number;
  unattempted?: number;
  timeTakenMinutes?: number;
}

// A planned block = one session's worth of planned work on one date.
// This is the immutable "source of truth" seeded from the schedule.
export interface PlannedTask {
  id: string; // stable id, e.g. "2026-09-09-day"
  date: string; // ISO yyyy-mm-dd
  session: SessionLabel;
  subject: string; // inferred/explicit subject tag, editable
  topic: string; // the actual planned text, preserved from source
  plannedTarget?: string; // e.g. hours target for that day (phase 2 schedules)
  needsReview?: boolean; // flagged during import as ambiguous/uncertain
  reviewNote?: string;
  phase: 1 | 2; // 1 = handwritten Day/Night schedule, 2 = typed Master Plan
}

// Actual progress submitted by the user for a given PlannedTask.
export interface TaskProgress {
  taskId: string; // matches PlannedTask.id
  status: TaskStatus;
  completionPercentage: number; // 0,25,50,75,100
  actualStudyMinutes: number;
  pyqsAttempted: number;
  pyqsCorrect: number;
  pyqsWrong: number;
  pyqsUnattempted: number;
  revisionDone: boolean;
  test: TestData;
  mistakes: string;
  learned: string;
  difficulty?: 'easy' | 'moderate' | 'hard';
  notes: string;
  submittedAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}

export interface ErrorLogEntry {
  id: string;
  date: string;
  subject: string;
  topic: string;
  reference?: string;
  mistake: string;
  correctConcept: string;
  status: 'unreviewed' | 'reviewed' | 'fixed';
  taskId?: string;
}

export interface WeeklyNote {
  weekStart: string; // ISO date (Monday) of the week
  notes: string;
}

// The full persisted app state
export interface AppState {
  progress: Record<string, TaskProgress>; // keyed by taskId
  errorLog: ErrorLogEntry[];
  weeklyNotes: Record<string, WeeklyNote>;
  editsToSchedule: Record<string, Partial<PlannedTask>>; // user edits layered over seed data, keyed by taskId
  customTasks: PlannedTask[]; // tasks added by the user beyond the seed
  deletedTaskIds: string[]; // seed tasks the user deleted
  revisionNotes: Record<string, string>; // user-added revision content, keyed by subject key
  dataVersion: number;
}

export const EMPTY_STATE: AppState = {
  progress: {},
  errorLog: [],
  weeklyNotes: {},
  editsToSchedule: {},
  customTasks: [],
  deletedTaskIds: [],
  revisionNotes: {},
  dataVersion: 1,
};

export const GATE_EXAM_DATE = '2027-02-07T09:00:00';

export const COMPLETION_WEIGHT: Record<TaskStatus, number> = {
  not_started: 0,
  in_progress: 0,
  completed: 100,
  partial: 0, // partial uses completionPercentage instead
  skipped: 0,
};
