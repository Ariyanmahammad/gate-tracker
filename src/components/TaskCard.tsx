import { useState } from 'react';
import type { PlannedTask } from '../types';
import { useData } from '../context/DataContext';
import { getTaskStatus, getCompletionPct } from '../utils/tasks';
import StatusBadge from './StatusBadge';
import ProgressModal from './ProgressModal';
import { AlertCircle, CheckCircle2, PencilLine } from 'lucide-react';

export default function TaskCard({ task, showDate }: { task: PlannedTask; showDate?: boolean }) {
  const { state, saveProgress } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const status = getTaskStatus(state, task.id);
  const pct = getCompletionPct(state, task.id);

  function quickComplete() {
    const existing = state.progress[task.id];
    const now = new Date().toISOString();
    saveProgress(task.id, {
      taskId: task.id,
      status: 'completed',
      completionPercentage: 100,
      actualStudyMinutes: existing?.actualStudyMinutes || 0,
      pyqsAttempted: existing?.pyqsAttempted || 0,
      pyqsCorrect: existing?.pyqsCorrect || 0,
      pyqsWrong: existing?.pyqsWrong || 0,
      pyqsUnattempted: existing?.pyqsUnattempted || 0,
      revisionDone: existing?.revisionDone || false,
      test: existing?.test || { taken: false },
      mistakes: existing?.mistakes || '',
      learned: existing?.learned || '',
      difficulty: existing?.difficulty,
      notes: existing?.notes || '',
      submittedAt: existing?.submittedAt || now,
      updatedAt: now,
    });
  }

  return (
    <div className="rounded-2xl border border-white bg-white/90 backdrop-blur-sm p-4 shadow-md shadow-indigo-100/40 hover:shadow-lg transition">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-wide text-indigo-500 font-bold flex items-center gap-1.5">
            {showDate ? `${task.date} · ${task.session}` : task.session} · {task.subject}
            {task.needsReview && (
              <span title={task.reviewNote}>
                <AlertCircle size={12} className="text-amber-500" />
              </span>
            )}
          </div>
          <div className="text-sm text-slate-700 mt-1 leading-snug">{task.topic}</div>
          {task.plannedTarget && <div className="text-[11px] text-slate-400 mt-1">{task.plannedTarget}</div>}
        </div>
        <StatusBadge status={status} pct={pct} />
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={quickComplete}
          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-emerald-200 text-emerald-600 font-semibold hover:bg-emerald-50"
        >
          <CheckCircle2 size={13} /> Mark Complete
        </button>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold hover:from-indigo-700 hover:to-violet-700 shadow-sm"
        >
          <PencilLine size={13} /> Submit Progress
        </button>
      </div>
      {modalOpen && <ProgressModal task={task} onClose={() => setModalOpen(false)} />}
    </div>
  );
}
