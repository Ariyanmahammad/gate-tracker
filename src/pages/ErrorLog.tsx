import { useMemo, useState } from 'react';
import { useData } from '../context/DataContext';
import type { ErrorLogEntry } from '../types';
import { Plus, Trash2 } from 'lucide-react';

const STATUS_OPTIONS: ErrorLogEntry['status'][] = ['unreviewed', 'reviewed', 'fixed'];
const STATUS_STYLE: Record<ErrorLogEntry['status'], string> = {
  unreviewed: 'from-rose-400 to-red-500',
  reviewed: 'from-amber-400 to-orange-500',
  fixed: 'from-emerald-400 to-teal-500',
};

export default function ErrorLogPage() {
  const { state, addErrorLogEntry, updateErrorLogEntry, deleteErrorLogEntry, tasks } = useData();
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | ErrorLogEntry['status']>('all');
  const [showForm, setShowForm] = useState(false);

  const subjects = useMemo(() => [...new Set(tasks.map((t) => t.subject))].sort(), [tasks]);

  const filtered = state.errorLog.filter((e) => {
    if (subjectFilter !== 'all' && e.subject !== subjectFilter) return false;
    if (statusFilter !== 'all' && e.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-rose-600">Weak Areas</span>
            <h1 className="bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-3xl font-bold text-transparent">Error Log</h1>
          </div>
          <button onClick={() => setShowForm((s) => !s)} className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-orange-600 text-white font-semibold shadow-lg shadow-rose-200">
            <Plus size={14} /> Add Error
          </button>
        </div>

        {showForm && <NewErrorForm onAdd={(e) => { addErrorLogEntry(e); setShowForm(false); }} />}

        <div className="flex gap-2 bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow-md shadow-rose-100/50">
          <select className="input" value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)}>
            <option value="all">All subjects</option>
            {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}>
            <option value="all">All statuses</option>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="space-y-2">
          {filtered.length === 0 && <div className="text-sm text-slate-400 text-center py-8">No errors logged yet.</div>}
          {filtered.map((e) => (
            <div key={e.id} className="rounded-2xl bg-white/90 backdrop-blur-sm shadow-md shadow-rose-100/40 p-4">
              <div className="flex justify-between items-start gap-2">
                <div className="text-[11px] uppercase text-rose-500 font-bold">{e.date} · {e.subject} · {e.topic}</div>
                <button onClick={() => deleteErrorLogEntry(e.id)} className="text-slate-300 hover:text-rose-500"><Trash2 size={14} /></button>
              </div>
              <div className="text-sm mt-1 text-slate-700"><span className="font-bold">Mistake:</span> {e.mistake}</div>
              {e.correctConcept && <div className="text-sm mt-0.5 text-slate-700"><span className="font-bold">Correct concept:</span> {e.correctConcept}</div>}
              <div className="flex gap-1.5 mt-2">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => updateErrorLogEntry(e.id, { status: s })}
                    className={`text-[11px] px-2.5 py-1 rounded-full font-semibold capitalize transition ${
                      e.status === s ? `bg-gradient-to-r ${STATUS_STYLE[s]} text-white shadow-sm` : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NewErrorForm({ onAdd }: { onAdd: (e: ErrorLogEntry) => void }) {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [reference, setReference] = useState('');
  const [mistake, setMistake] = useState('');
  const [correctConcept, setCorrectConcept] = useState('');

  return (
    <div className="rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg shadow-rose-100/50 p-4 space-y-2">
      <input className="input w-full" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
      <input className="input w-full" placeholder="Topic" value={topic} onChange={(e) => setTopic(e.target.value)} />
      <input className="input w-full" placeholder="Question / reference (optional)" value={reference} onChange={(e) => setReference(e.target.value)} />
      <textarea className="input w-full min-h-[60px]" placeholder="Mistake" value={mistake} onChange={(e) => setMistake(e.target.value)} />
      <textarea className="input w-full min-h-[60px]" placeholder="Correct concept" value={correctConcept} onChange={(e) => setCorrectConcept(e.target.value)} />
      <button
        onClick={() => {
          if (!mistake.trim()) return;
          onAdd({
            id: `manual-${Date.now()}`,
            date: new Date().toISOString().slice(0, 10),
            subject: subject || 'General',
            topic: topic || 'General',
            reference: reference || undefined,
            mistake,
            correctConcept,
            status: 'unreviewed',
          });
        }}
        className="bg-gradient-to-r from-rose-600 to-orange-600 text-white rounded-xl px-4 py-2 text-sm font-semibold shadow-md"
      >
        Save
      </button>
    </div>
  );
}
