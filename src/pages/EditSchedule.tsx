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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-violet-50">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Admin</span>
            <h1 className="bg-gradient-to-r from-slate-700 to-indigo-600 bg-clip-text text-3xl font-bold text-transparent">Edit Schedule</h1>
          </div>
          <button onClick={() => setAdding(true)} className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-lg shadow-indigo-200">
            <Plus size={14} /> Add Task
          </button>
        </div>

        <div className="rounded-2xl bg-white/90 backdrop-blur-sm shadow-md shadow-indigo-100/50 p-4 flex flex-wrap gap-3 items-center">
          <button onClick={handleExport} className="flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-lg bg-emerald-50 text-emerald-700 font-semibold hover:bg-emerald-100">
            <Download size={14} /> Export Data (JSON)
          </button>
          <label className="flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-lg bg-cyan-50 text-cyan-700 font-semibold cursor-pointer hover:bg-cyan-100">
            <Upload size={14} /> Import Data (JSON)
            <input type="file" accept="application/json" className="hidden" onChange={handleImport} />
          </label>
          <button onClick={resetAllData} className="flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-lg bg-rose-50 text-rose-600 font-semibold ml-auto hover:bg-rose-100">
            Reset All Data
          </button>
        </div>

        {adding && <TaskForm onSave={(t) => { addCustomTask(t); setAdding(false); }} onCancel={() => setAdding(false)} />}

        <div>
          <div className="flex items-center gap-2 mb-2">
            <input type="date" className="input" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
            {dateFilter && <button className="text-xs text-indigo-500 font-semibold" onClick={() => setDateFilter('')}>Clear (show flagged items)</button>}
          </div>
          {!dateFilter && (
            <div className="text-xs text-amber-600 font-medium mb-2 flex items-center gap-1.5 bg-amber-50 rounded-lg px-3 py-2">
              <AlertTriangle size={13} />
              Showing {flagged.length} item{flagged.length !== 1 ? 's' : ''} flagged during import as ambiguous or incomplete. Pick a date above to browse/edit any day.
            </div>
          )}
          <div className="space-y-2">
            {filtered.map((t) => (
              <div key={t.id} className="rounded-2xl bg-white/90 backdrop-blur-sm shadow-md shadow-indigo-100/40 p-3.5">
                {editingId === t.id ? (
                  <TaskForm
                    initial={t}
                    onSave={(patch) => { editTask(t.id, patch); setEditingId(null); }}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="text-[11px] uppercase text-indigo-500 font-bold flex items-center gap-1.5">
                        {t.date} · {t.session} · {t.subject}
                        {t.needsReview && <AlertTriangle size={12} className="text-amber-500" />}
                      </div>
                      <div className="text-sm text-slate-700">{t.topic}</div>
                      {t.reviewNote && <div className="text-xs text-amber-600 mt-1">{t.reviewNote}</div>}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => setEditingId(t.id)} className="text-slate-400 hover:text-indigo-600"><Pencil size={14} /></button>
                      <button onClick={() => { if (confirm('Delete this task?')) deleteTask(t.id); }} className="text-slate-400 hover:text-rose-500"><Trash2 size={14} /></button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {filtered.length === 0 && <div className="text-sm text-slate-400 text-center py-6">Nothing to show.</div>}
          </div>
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
    <div className="rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg shadow-indigo-100/50 p-4 space-y-2">
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
          className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl px-4 py-1.5 text-sm font-semibold shadow-md"
        >
          Save
        </button>
        <button onClick={onCancel} className="text-sm text-slate-400 px-3 py-1.5">Cancel</button>
      </div>
    </div>
  );
}
