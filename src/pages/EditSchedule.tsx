import { useMemo, useState } from 'react';
import { useData } from '../context/DataContext';
import type { PlannedTask, SessionLabel } from '../types';
import { exportStateAsJSON, downloadJSON, parseImportedJSON } from '../utils/storage';
import { Plus, Trash2, Pencil, Download, Upload, AlertTriangle } from 'lucide-react';

const SESSIONS: SessionLabel[] = ['Day', 'Night', 'Morning', 'Afternoon', 'Evening', 'Night/Analysis'];

export default function EditSchedule() {
  const { state, tasks, addCustomTask, editTask, deleteTask, replaceState, resetAllData } = useData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [dateFilter, setDateFilter] = useState('');

  const flagged = useMemo(() => tasks.filter((t) => t.needsReview), [tasks]);
  const filtered = dateFilter ? tasks.filter((t) => t.date === dateFilter) : flagged;

  function handleExport() {
    downloadJSON(`gate-2027-progress-${new Date().toISOString().slice(0, 10)}.json`, exportStateAsJSON(state));
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const parsed = parseImportedJSON(String(reader.result));
      if (parsed) {
        if (confirm('This will replace your current data with the imported file. Continue?')) {
          replaceState(parsed);
        }
      } else {
        alert('Could not read this file — make sure it is a JSON export from this app.');
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[#1c2128]">Edit Schedule</h1>
        <button onClick={() => setAdding(true)} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-[#8a3324] text-white">
          <Plus size={14} /> Add Task
        </button>
      </div>

      <div className="rounded-xl border border-[#e4e1d8] bg-white p-4 flex flex-wrap gap-3 items-center">
        <button onClick={handleExport} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-[#ddd8ca]">
          <Download size={14} /> Export Data (JSON)
        </button>
        <label className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-[#ddd8ca] cursor-pointer">
          <Upload size={14} /> Import Data (JSON)
          <input type="file" accept="application/json" className="hidden" onChange={handleImport} />
        </label>
        <button onClick={resetAllData} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-[#f3c9c9] text-[#a13a3a] ml-auto">
          Reset All Data
        </button>
      </div>

      {adding && <TaskForm onSave={(t) => { addCustomTask(t); setAdding(false); }} onCancel={() => setAdding(false)} />}

      <div>
        <div className="flex items-center gap-2 mb-2">
          <input type="date" className="input" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
          {dateFilter && <button className="text-xs text-[#8a8677]" onClick={() => setDateFilter('')}>Clear (show flagged items)</button>}
        </div>
        {!dateFilter && (
          <div className="text-xs text-[#8a8677] mb-2 flex items-center gap-1.5">
            <AlertTriangle size={13} className="text-[#b8862c]" />
            Showing {flagged.length} item{flagged.length !== 1 ? 's' : ''} flagged during import as ambiguous or incomplete. Pick a date above to browse/edit any day.
          </div>
        )}
        <div className="space-y-2">
          {filtered.map((t) => (
            <div key={t.id} className="rounded-xl border border-[#e4e1d8] bg-white p-3">
              {editingId === t.id ? (
                <TaskForm
                  initial={t}
                  onSave={(patch) => { editTask(t.id, patch); setEditingId(null); }}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <div className="text-[11px] uppercase text-[#8a8677] flex items-center gap-1.5">
                      {t.date} · {t.session} · {t.subject}
                      {t.needsReview && <AlertTriangle size={12} className="text-[#b8862c]" />}
                    </div>
                    <div className="text-sm">{t.topic}</div>
                    {t.reviewNote && <div className="text-xs text-[#b8862c] mt-1">{t.reviewNote}</div>}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => setEditingId(t.id)} className="text-[#8a8677] hover:text-[#1c2128]"><Pencil size={14} /></button>
                    <button onClick={() => { if (confirm('Delete this task?')) deleteTask(t.id); }} className="text-[#8a8677] hover:text-[#a13a3a]"><Trash2 size={14} /></button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && <div className="text-sm text-[#8a8677] text-center py-6">Nothing to show.</div>}
        </div>
      </div>
    </div>
  );
}

function TaskForm({
  initial, onSave, onCancel,
}: { initial?: PlannedTask; onSave: (t: any) => void; onCancel: () => void }) {
  const [date, setDate] = useState(initial?.date || new Date().toISOString().slice(0, 10));
  const [session, setSession] = useState<SessionLabel>(initial?.session || 'Day');
  const [subject, setSubject] = useState(initial?.subject || '');
  const [topic, setTopic] = useState(initial?.topic || '');

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
        <select className="input" value={session} onChange={(e) => setSession(e.target.value as SessionLabel)}>
          {SESSIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <input className="input w-full" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
      <textarea className="input w-full min-h-[60px]" placeholder="Topic / planned text" value={topic} onChange={(e) => setTopic(e.target.value)} />
      <div className="flex gap-2">
        <button
          onClick={() => onSave(initial
            ? { date, session, subject, topic, needsReview: false, reviewNote: undefined }
            : { id: `custom-${Date.now()}`, date, session, subject: subject || 'General', topic, phase: 2 })}
          className="bg-[#8a3324] text-white rounded-lg px-4 py-1.5 text-sm"
        >
          Save
        </button>
        <button onClick={onCancel} className="text-sm text-[#8a8677] px-3 py-1.5">Cancel</button>
      </div>
    </div>
  );
}
