import type { TaskStatus } from '../types';

const STYLES: Record<TaskStatus, string> = {
  not_started: 'bg-[#eeece3] text-[#8a8677]',
  in_progress: 'bg-[#fdedd3] text-[#946200]',
  completed: 'bg-[#dcece1] text-[#296b45]',
  partial: 'bg-[#fdf1c9] text-[#8a6a00]',
  skipped: 'bg-[#f6dede] text-[#a13a3a]',
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
    <span className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded-full ${STYLES[status]}`}>
      {label}
    </span>
  );
}
