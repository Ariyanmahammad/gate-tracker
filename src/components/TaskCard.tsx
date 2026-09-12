import { useState } from 'react';
import type { PlannedTask } from '../types';
import { useData } from '../context/DataContext';
import { getTaskStatus, getCompletionPct } from '../utils/tasks';
import StatusBadge from './StatusBadge';
import ProgressModal from './ProgressModal';
import { AlertCircle } from 'lucide-react';

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
    <div className="rounded-xl border border-[#e4e1d8] bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-wide text-[#8a8677] font-medium flex items-center gap-1.5">
            {showDate ? `${task.date} · ${task.session}` : task.session} · {task.subject}
            {task.needsReview && (
              <span title={task.reviewNote}>
                <AlertCircle size={12} className="text-[#b8862c]" />
              </span>
            )}
          </div>
          <div className="text-sm text-[#1c2128] mt-1 leading-snug">{task.topic}</div>
          {task.plannedTarget && <div className="text-[11px] text-[#a39d8a] mt-1">{task.plannedTarget}</div>}
        </div>
        <StatusBadge status={status} pct={pct} />
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={quickComplete}
          className="text-xs px-3 py-1.5 rounded-lg border border-[#ddd8ca] text-[#4a4638] hover:bg-[#f6f5f1]"
        >
          Mark Complete
        </button>
        <button
          onClick={() => setModalOpen(true)}
          className="text-xs px-3 py-1.5 rounded-lg bg-[#8a3324] text-white hover:bg-[#752a1d]"
        >
          Submit Progress
        </button>
      </div>
      {modalOpen && <ProgressModal task={task} onClose={() => setModalOpen(false)} />}
    </div>
  );
}
