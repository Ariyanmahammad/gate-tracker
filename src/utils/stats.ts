import type { AppState, PlannedTask } from "../types";
import { getCompletionPct, todayISO } from "./tasks";

export function isPastOrToday(date: string): boolean {
  return date <= todayISO();
}

// Only past/current tasks count toward completion stats (future tasks are excluded).
export function relevantTasks(tasks: PlannedTask[]): PlannedTask[] {
  return tasks.filter((t) => isPastOrToday(t.date));
}

export function dayCompletionPct(
  state: AppState,
  dayTasks: PlannedTask[],
): number {
  if (dayTasks.length === 0) return 0;
  const total = dayTasks.reduce(
    (sum, t) => sum + getCompletionPct(state, t.id),
    0,
  );
  return Math.round(total / dayTasks.length);
}

export function overallCompletionPct(
  state: AppState,
  tasks: PlannedTask[],
): number {
  const past = relevantTasks(tasks);
  if (past.length === 0) return 0;
  const total = past.reduce((sum, t) => sum + getCompletionPct(state, t.id), 0);
  return Math.round(total / past.length);
}

export function isSubmitted(state: AppState, taskId: string): boolean {
  const p = state.progress[taskId];
  return !!p && p.status !== "not_started";
}

export function totalStudyMinutes(state: AppState): number {
  return Object.values(state.progress).reduce(
    (sum, p) => sum + (p.actualStudyMinutes || 0),
    0,
  );
}

export function totalPYQs(state: AppState) {
  let attempted = 0,
    correct = 0,
    wrong = 0,
    unattempted = 0;
  for (const p of Object.values(state.progress)) {
    attempted += p.pyqsAttempted || 0;
    correct += p.pyqsCorrect || 0;
    wrong += p.pyqsWrong || 0;
    unattempted += p.pyqsUnattempted || 0;
  }
  const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
  return { attempted, correct, wrong, unattempted, accuracy };
}

export function testStats(state: AppState) {
  const tests = Object.values(state.progress)
    .filter((p) => p.test?.taken)
    .map((p) => ({ ...p.test, date: p.updatedAt, taskId: p.taskId }));
  if (tests.length === 0)
    return { count: 0, best: 0, average: 0, avgAccuracy: 0, tests: [] };
  const pcts = tests
    .filter((t) => t.totalMarks && t.totalMarks > 0)
    .map((t) => ((t.marksObtained || 0) / (t.totalMarks || 1)) * 100);
  const best = pcts.length ? Math.round(Math.max(...pcts)) : 0;
  const average = pcts.length
    ? Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length)
    : 0;
  const accs = tests
    .filter((t) => (t.correct || 0) + (t.wrong || 0) > 0)
    .map((t) => ((t.correct || 0) / ((t.correct || 0) + (t.wrong || 0))) * 100);
  const avgAccuracy = accs.length
    ? Math.round(accs.reduce((a, b) => a + b, 0) / accs.length)
    : 0;
  return { count: tests.length, best, average, avgAccuracy, tests };
}
const PREP_START_DATE = new Date('2026-02-09'); // day 1 of your prep

function daysSinceStart(): number {
  const diff = Date.now() - PREP_START_DATE.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function currentStreak(state: AppState, tasks: PlannedTask[]): number {
  const byDate = new Map<string, PlannedTask[]>();
  for (const t of relevantTasks(tasks)) {
    if (!byDate.has(t.date)) byDate.set(t.date, []);
    byDate.get(t.date)!.push(t);
  }
  const dates = [...byDate.keys()].sort().reverse();
  let streak = 0;
  for (const d of dates) {
    const pct = dayCompletionPct(state, byDate.get(d)!);
    if (pct >= 50) streak++;
    else break;
  }
  return streak + daysSinceStart();
}
export function longestStreak(state: AppState, tasks: PlannedTask[]): number {
  const byDate = new Map<string, PlannedTask[]>();
  for (const t of relevantTasks(tasks)) {
    if (!byDate.has(t.date)) byDate.set(t.date, []);
    byDate.get(t.date)!.push(t);
  }
  const dates = [...byDate.keys()].sort();
  let longest = 0,
    cur = 0;
  for (const d of dates) {
    const pct = dayCompletionPct(state, byDate.get(d)!);
    if (pct >= 50) {
      cur++;
      longest = Math.max(longest, cur);
    } else {
      cur = 0;
    }
  }
  return longest;
}

export function subjectStats(state: AppState, tasks: PlannedTask[]) {
  const bySubject = new Map<string, PlannedTask[]>();
  for (const t of tasks) {
    if (!bySubject.has(t.subject)) bySubject.set(t.subject, []);
    bySubject.get(t.subject)!.push(t);
  }
  return [...bySubject.entries()]
    .map(([subject, subjTasks]) => {
      const past = relevantTasks(subjTasks);
      const completed = past.filter(
        (t) => state.progress[t.id]?.status === "completed",
      ).length;
      const partial = past.filter(
        (t) => state.progress[t.id]?.status === "partial",
      ).length;
      const skipped = past.filter(
        (t) => state.progress[t.id]?.status === "skipped",
      ).length;
      const pct = past.length
        ? Math.round(
            past.reduce((s, t) => s + getCompletionPct(state, t.id), 0) /
              past.length,
          )
        : 0;
      let pyqs = 0,
        minutes = 0,
        correct = 0,
        attempted = 0;
      for (const t of subjTasks) {
        const p = state.progress[t.id];
        if (!p) continue;
        pyqs += p.pyqsAttempted || 0;
        attempted += p.pyqsAttempted || 0;
        correct += p.pyqsCorrect || 0;
        minutes += p.actualStudyMinutes || 0;
      }
      return {
        subject,
        totalTasks: subjTasks.length,
        completed,
        partial,
        skipped,
        completionPct: pct,
        pyqsSolved: pyqs,
        accuracy: attempted ? Math.round((correct / attempted) * 100) : 0,
        studyHours: Math.round((minutes / 60) * 10) / 10,
      };
    })
    .sort((a, b) => a.subject.localeCompare(b.subject));
}

export function missedTasks(
  state: AppState,
  tasks: PlannedTask[],
): PlannedTask[] {
  return relevantTasks(tasks).filter((t) => !isSubmitted(state, t.id));
}

export function formatMinutes(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}

export function daysUntilExam(): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  const exam = new Date("2027-02-07T09:00:00");
  const now = new Date();
  const diff = Math.max(0, exam.getTime() - now.getTime());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}
