import { useState } from 'react';
import { X } from 'lucide-react';
import type { PlannedTask, TaskProgress, TaskStatus } from '../types';
import { useData } from '../context/DataContext';
import { defaultProgress } from '../utils/tasks';

export default function ProgressModal({
  task, onClose,
}: { task: PlannedTask; onClose: () => void }) {
  const { state, saveProgress, addErrorLogEntry } = useData();
  const existing = state.progress[task.id];
  const [form, setForm] = useState<TaskProgress>(existing ? { ...existing } : defaultProgress(task.id));

  function set<K extends keyof TaskProgress>(key: K, value: TaskProgress[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function submit() {
    const now = new Date().toISOString();
    const finalStatus: TaskStatus = form.status === 'not_started' ? 'in_progress' : form.status;
    const toSave: TaskProgress = {
      ...form,
      status: finalStatus,
      completionPercentage: finalStatus === 'completed' ? 100 : finalStatus === 'skipped' ? 0 : form.completionPercentage,
      updatedAt: now,
      submittedAt: existing?.submittedAt || now,
    };
    saveProgress(task.id, toSave);
    if (form.mistakes.trim()) {
      addErrorLogEntry({
        id: `${task.id}-err-${Date.now()}`,
        date: task.date,
        subject: task.subject,
        topic: task.topic,
        mistake: form.mistakes.trim(),
        correctConcept: form.learned.trim(),
        status: 'unreviewed',
        taskId: task.id,
      });
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 p-0 md:p-4">
      <div className="bg-white w-full md:max-w-xl md:rounded-2xl rounded-t-2xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-[#eee] px-5 py-4 flex items-start justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wide text-[#8a8677]">{task.session} · {task.subject}</div>
            <div className="font-semibold text-[#1c2128]">{task.topic}</div>
          </div>
          <button onClick={onClose} className="text-[#8a8677] hover:text-[#1c2128]"><X size={20} /></button>
        </div>

        <div className="p-5 space-y-5">
          <Field label="Status">
            <div className="flex flex-wrap gap-2">
              {(['completed', 'partial', 'skipped', 'in_progress'] as TaskStatus[]).map((s) => (
                <button
                  key={s}
                  onClick={() => set('status', s)}
                  className={`px-3 py-1.5 rounded-lg text-sm border ${
                    form.status === s ? 'bg-[#8a3324] text-white border-[#8a3324]' : 'border-[#ddd8ca] text-[#4a4638]'
                  }`}
                >
                  {s === 'completed' ? 'Completed' : s === 'partial' ? 'Partially Completed' : s === 'skipped' ? 'Skipped' : 'In Progress'}
                </button>
              ))}
            </div>
          </Field>

          {form.status === 'partial' && (
            <Field label="Completion percentage">
              <div className="flex gap-2">
                {[25, 50, 75].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => set('completionPercentage', pct)}
                    className={`px-3 py-1.5 rounded-lg text-sm border ${
                      form.completionPercentage === pct ? 'bg-[#8a3324] text-white border-[#8a3324]' : 'border-[#ddd8ca]'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </Field>
          )}

          <Field label="Actual study time">
            <div className="flex gap-3 items-center">
              <NumberInput value={Math.floor(form.actualStudyMinutes / 60)} onChange={(h) => set('actualStudyMinutes', h * 60 + (form.actualStudyMinutes % 60))} suffix="hrs" />
              <NumberInput value={form.actualStudyMinutes % 60} onChange={(m) => set('actualStudyMinutes', Math.floor(form.actualStudyMinutes / 60) * 60 + m)} suffix="min" max={59} />
            </div>
          </Field>

          <Field label="PYQs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <LabeledNumber label="Attempted" value={form.pyqsAttempted} onChange={(v) => set('pyqsAttempted', v)} />
              <LabeledNumber label="Correct" value={form.pyqsCorrect} onChange={(v) => set('pyqsCorrect', v)} />
              <LabeledNumber label="Wrong" value={form.pyqsWrong} onChange={(v) => set('pyqsWrong', v)} />
              <LabeledNumber label="Unattempted" value={form.pyqsUnattempted} onChange={(v) => set('pyqsUnattempted', v)} />
            </div>
          </Field>

          <Field label="Revision done?">
            <ToggleYesNo value={form.revisionDone} onChange={(v) => set('revisionDone', v)} />
          </Field>

          <Field label="Test taken?">
            <ToggleYesNo value={form.test.taken} onChange={(v) => set('test', { ...form.test, taken: v })} />
            {form.test.taken && (
              <div className="mt-3 space-y-2">
                <input
                  className="input"
                  placeholder="Test name"
                  value={form.test.testName || ''}
                  onChange={(e) => set('test', { ...form.test, testName: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-2">
                  <LabeledNumber label="Marks obtained" value={form.test.marksObtained || 0} onChange={(v) => set('test', { ...form.test, marksObtained: v })} />
                  <LabeledNumber label="Total marks" value={form.test.totalMarks || 0} onChange={(v) => set('test', { ...form.test, totalMarks: v })} />
                  <LabeledNumber label="Correct" value={form.test.correct || 0} onChange={(v) => set('test', { ...form.test, correct: v })} />
                  <LabeledNumber label="Wrong" value={form.test.wrong || 0} onChange={(v) => set('test', { ...form.test, wrong: v })} />
                  <LabeledNumber label="Unattempted" value={form.test.unattempted || 0} onChange={(v) => set('test', { ...form.test, unattempted: v })} />
                  <LabeledNumber label="Time taken (min)" value={form.test.timeTakenMinutes || 0} onChange={(v) => set('test', { ...form.test, timeTakenMinutes: v })} />
                </div>
              </div>
            )}
          </Field>

          <Field label="Mistakes / weak areas">
            <textarea className="input min-h-[70px]" value={form.mistakes} onChange={(e) => set('mistakes', e.target.value)} placeholder="What went wrong? (added to your Error Log automatically)" />
          </Field>

          <Field label="What I learned">
            <textarea className="input min-h-[60px]" value={form.learned} onChange={(e) => set('learned', e.target.value)} />
          </Field>

          <Field label="Difficulty">
            <div className="flex gap-2">
              {(['easy', 'moderate', 'hard'] as const).map((d) => (
                <button key={d} onClick={() => set('difficulty', d)} className={`px-3 py-1.5 rounded-lg text-sm border capitalize ${form.difficulty === d ? 'bg-[#8a3324] text-white border-[#8a3324]' : 'border-[#ddd8ca]'}`}>
                  {d}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Notes (optional)">
            <textarea className="input min-h-[50px]" value={form.notes} onChange={(e) => set('notes', e.target.value)} />
          </Field>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-[#eee] px-5 py-4">
          <button onClick={submit} className="w-full bg-[#8a3324] text-white rounded-lg py-2.5 font-medium hover:bg-[#752a1d]">
            Save Daily Progress
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-sm font-medium text-[#1c2128] mb-1.5">{label}</div>
      {children}
    </div>
  );
}

function NumberInput({ value, onChange, suffix, max }: { value: number; onChange: (v: number) => void; suffix?: string; max?: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <input
        type="number"
        className="input w-20"
        value={value}
        min={0}
        max={max}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
      />
      {suffix && <span className="text-sm text-[#8a8677]">{suffix}</span>}
    </div>
  );
}

function LabeledNumber({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <div className="text-[11px] text-[#8a8677] mb-0.5">{label}</div>
      <input
        type="number"
        className="input w-full"
        value={value}
        min={0}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
      />
    </label>
  );
}

function ToggleYesNo({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex gap-2">
      <button onClick={() => onChange(true)} className={`px-3 py-1.5 rounded-lg text-sm border ${value ? 'bg-[#8a3324] text-white border-[#8a3324]' : 'border-[#ddd8ca]'}`}>Yes</button>
      <button onClick={() => onChange(false)} className={`px-3 py-1.5 rounded-lg text-sm border ${!value ? 'bg-[#8a3324] text-white border-[#8a3324]' : 'border-[#ddd8ca]'}`}>No</button>
    </div>
  );
}
