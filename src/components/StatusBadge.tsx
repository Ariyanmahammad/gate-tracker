import type { TaskStatus } from '../types';

const STYLES: Record<TaskStatus, string> = {
  not_started: 'bg-slate-100 text-slate-500',
  in_progress: 'bg-gradient-to-r from-amber-400 to-orange-400 text-white',
  completed: 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white',
  partial: 'bg-gradient-to-r from-amber-300 to-yellow-400 text-amber-900',
  skipped: 'bg-gradient-to-r from-rose-400 to-red-500 text-white',
};

const LABELS: Record<TaskStatus, string> = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  completed: 'Completed',
  partial: 'Partial',
  skipped: 'Skipped',
};

export default function StatusBadge({ status, pct }: { status: TaskStatus; pct?: number }) {
  const label = status === 'partial' && pct ? `Partial ${pct}%` : LABELS[status];
  return (
    <span className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm ${STYLES[status]}`}>
      {label}
    </span>
  );
}
