import { useMemo, useState } from 'react';
import { useData } from '../context/DataContext';
import type { ErrorLogEntry } from '../types';
import { Plus, Trash2 } from 'lucide-react';

const STATUS_OPTIONS: ErrorLogEntry['status'][] = ['unreviewed', 'reviewed', 'fixed'];

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
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[#1c2128]">Error Log</h1>
        <button onClick={() => setShowForm((s) => !s)} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-[#8a3324] text-white">
          <Plus size={14} /> Add Error
        </button>
      </div>

      {showForm && <NewErrorForm onAdd={(e) => { addErrorLogEntry(e); setShowForm(false); }} />}

      <div className="flex gap-2">
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
        {filtered.length === 0 && <div className="text-sm text-[#8a8677] text-center py-8">No errors logged yet.</div>}
        {filtered.map((e) => (
          <div key={e.id} className="rounded-xl border border-[#e4e1d8] bg-white p-3">
            <div className="flex justify-between items-start gap-2">
              <div className="text-[11px] uppercase text-[#8a8677]">{e.date} · {e.subject} · {e.topic}</div>
              <button onClick={() => deleteErrorLogEntry(e.id)} className="text-[#a39d8a] hover:text-[#a13a3a]"><Trash2 size={14} /></button>
            </div>
            <div className="text-sm mt-1"><span className="font-medium">Mistake:</span> {e.mistake}</div>
            {e.correctConcept && <div className="text-sm mt-0.5"><span className="font-medium">Correct concept:</span> {e.correctConcept}</div>}
            <div className="flex gap-1.5 mt-2">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => updateErrorLogEntry(e.id, { status: s })}
                  className={`text-[11px] px-2 py-0.5 rounded-full border capitalize ${e.status === s ? 'bg-[#8a3324] text-white border-[#8a3324]' : 'border-[#ddd8ca] text-[#8a8677]'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ))}
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
    <div className="rounded-xl border border-[#e4e1d8] bg-white p-4 space-y-2">
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
        className="bg-[#8a3324] text-white rounded-lg px-4 py-2 text-sm"
      >
        Save
      </button>
    </div>
  );
}
