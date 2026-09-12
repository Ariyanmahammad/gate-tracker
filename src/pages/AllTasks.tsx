import { useMemo, useState } from 'react';
import { useData } from '../context/DataContext';
import { getTaskStatus } from '../utils/tasks';
import type { TaskStatus } from '../types';
import TaskCard from '../components/TaskCard';

const STATUS_FILTERS: { value: TaskStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'completed', label: 'Completed' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'partial', label: 'Partial' },
  { value: 'skipped', label: 'Skipped' },
  { value: 'not_started', label: 'Not Started' },
];

export default function AllTasks() {
  const { state, tasks } = useData();
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [sessionFilter, setSessionFilter] = useState('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [search, setSearch] = useState('');

  const subjects = useMemo(() => [...new Set(tasks.map((t) => t.subject))].sort(), [tasks]);
  const sessions = useMemo(() => [...new Set(tasks.map((t) => t.session))], [tasks]);

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (statusFilter !== 'all' && getTaskStatus(state, t.id) !== statusFilter) return false;
      if (subjectFilter !== 'all' && t.subject !== subjectFilter) return false;
      if (sessionFilter !== 'all' && t.session !== sessionFilter) return false;
      if (from && t.date < from) return false;
      if (to && t.date > to) return false;
      if (search && !t.topic.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [tasks, state, statusFilter, subjectFilter, sessionFilter, from, to, search]);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 space-y-4">
      <h1 className="text-xl font-semibold text-[#1c2128]">All Tasks</h1>

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`text-xs px-3 py-1.5 rounded-full border ${statusFilter === f.value ? 'bg-[#8a3324] text-white border-[#8a3324]' : 'border-[#ddd8ca] bg-white'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        <select className="input" value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)}>
          <option value="all">All subjects</option>
          {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="input" value={sessionFilter} onChange={(e) => setSessionFilter(e.target.value)}>
          <option value="all">All sessions</option>
          {sessions.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <input type="date" className="input" value={from} onChange={(e) => setFrom(e.target.value)} />
        <input type="date" className="input" value={to} onChange={(e) => setTo(e.target.value)} />
        <input className="input" placeholder="Search topic…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="text-xs text-[#8a8677]">{filtered.length} task{filtered.length !== 1 ? 's' : ''}</div>

      <div className="space-y-2">
        {filtered.slice(0, 300).map((t) => <TaskCard key={t.id} task={t} showDate />)}
        {filtered.length > 300 && <div className="text-xs text-[#a39d8a] text-center py-2">Showing first 300 of {filtered.length} — narrow your filters to see more precisely.</div>}
        {filtered.length === 0 && <div className="text-sm text-[#8a8677] text-center py-8">No tasks match these filters.</div>}
      </div>
    </div>
  );
}
