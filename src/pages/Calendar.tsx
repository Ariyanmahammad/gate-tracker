import { useMemo, useState } from 'react';
import { useData } from '../context/DataContext';
import { dayCompletionPct, isPastOrToday, formatMinutes } from '../utils/stats';
import { getTasksForDate, todayISO } from '../utils/tasks';
import StatusBadge from '../components/StatusBadge';
import { getTaskStatus, getCompletionPct } from '../utils/tasks';

function toDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}
function toISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function CalendarPage() {
  const { state, tasks } = useData();
  const allDates = useMemo(() => [...new Set(tasks.map((t) => t.date))].sort(), [tasks]);
  const [monthCursor, setMonthCursor] = useState(() => {
    const t = todayISO();
    return allDates.includes(t) ? toDate(t) : toDate(allDates[0] || t);
  });
  const [selected, setSelected] = useState<string | null>(null);

  const year = monthCursor.getFullYear();
  const month = monthCursor.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startWeekday = firstOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (string | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(toISO(new Date(year, month, d)));

  function colorFor(date: string) {
    const dayTasks = getTasksForDate(tasks, date);
    if (dayTasks.length === 0) return 'bg-transparent text-slate-300';
    if (!isPastOrToday(date)) return 'bg-indigo-50 text-indigo-400';
    const submitted = dayTasks.some((t) => state.progress[t.id]);
    if (!submitted) return 'bg-slate-100 text-slate-400';
    const pct = dayCompletionPct(state, dayTasks);
    if (pct >= 75) return 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-sm';
    if (pct >= 40) return 'bg-gradient-to-br from-amber-300 to-yellow-400 text-amber-900 shadow-sm';
    return 'bg-gradient-to-br from-rose-400 to-red-500 text-white shadow-sm';
  }

  const selectedTasks = selected ? getTasksForDate(tasks, selected) : [];
  const selectedMinutes = selectedTasks.reduce((sum, t) => sum + (state.progress[t.id]?.actualStudyMinutes || 0), 0);
  const selectedPyqs = selectedTasks.reduce((sum, t) => sum + (state.progress[t.id]?.pyqsAttempted || 0), 0);
  const selectedCorrect = selectedTasks.reduce((sum, t) => sum + (state.progress[t.id]?.pyqsCorrect || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-indigo-50 to-violet-100/60">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 space-y-5">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-600">History</span>
          <h1 className="bg-gradient-to-r from-indigo-700 to-violet-600 bg-clip-text text-3xl font-bold text-transparent">Calendar</h1>
        </div>

        <div className="rounded-3xl bg-white/90 backdrop-blur-sm shadow-lg shadow-indigo-100/50 p-5">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setMonthCursor(new Date(year, month - 1, 1))} className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 text-sm font-bold hover:bg-indigo-100">‹</button>
            <div className="font-bold text-slate-700">{monthCursor.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</div>
            <button onClick={() => setMonthCursor(new Date(year, month + 1, 1))} className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 text-sm font-bold hover:bg-indigo-100">›</button>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <div key={i} className="text-[11px] text-slate-400 font-bold">{d}</div>
            ))}
            {cells.map((date, i) =>
              date ? (
                <button
                  key={i}
                  onClick={() => setSelected(date)}
                  className={`aspect-square rounded-xl text-xs font-bold flex items-center justify-center transition hover:scale-105 ${colorFor(date)} ${selected === date ? 'ring-2 ring-indigo-500 ring-offset-1' : ''}`}
                >
                  {Number(date.split('-')[2])}
                </button>
              ) : (
                <div key={i} />
              )
            )}
          </div>

          <div className="flex gap-3 text-[11px] text-slate-500 flex-wrap mt-4">
            <Legend gradient="from-emerald-400 to-teal-500" label="Completed well" />
            <Legend gradient="from-amber-300 to-yellow-400" label="Partial" />
            <Legend gradient="from-rose-400 to-red-500" label="Poor / missed" />
            <Legend gradient="bg-slate-200" label="Not yet attempted" plain />
            <Legend gradient="bg-indigo-100" label="Upcoming" plain />
          </div>
        </div>

        {selected && (
          <div className="rounded-3xl bg-white/90 backdrop-blur-sm shadow-lg shadow-indigo-100/50 p-5 space-y-3">
            <div className="font-bold text-slate-800">{selected}</div>
            {selectedTasks.length === 0 ? (
              <div className="text-sm text-slate-400">No planned tasks for this date.</div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                  <MiniStat label="Day completion" value={`${dayCompletionPct(state, selectedTasks)}%`} gradient="from-indigo-500 to-violet-600" />
                  <MiniStat label="Study time" value={formatMinutes(selectedMinutes)} gradient="from-cyan-500 to-blue-600" />
                  <MiniStat label="PYQs" value={`${selectedPyqs}`} gradient="from-emerald-500 to-teal-600" />
                  <MiniStat label="Accuracy" value={`${selectedPyqs ? Math.round((selectedCorrect / selectedPyqs) * 100) : 0}%`} gradient="from-fuchsia-500 to-pink-600" />
                </div>
                <div className="space-y-2">
                  {selectedTasks.map((t) => {
                    const p = state.progress[t.id];
                    const status = getTaskStatus(state, t.id);
                    const pct = getCompletionPct(state, t.id);
                    return (
                      <div key={t.id} className="border border-slate-100 rounded-xl p-3 bg-white">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <div className="text-[11px] uppercase text-indigo-500 font-bold">{t.session} · {t.subject}</div>
                            <div className="text-sm text-slate-700">{t.topic}</div>
                          </div>
                          <StatusBadge status={status} pct={pct} />
                        </div>
                        {p?.mistakes && <div className="text-xs text-rose-500 mt-2">Weak area: {p.mistakes}</div>}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Legend({ gradient, label, plain }: { gradient: string; label: string; plain?: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-3 h-3 rounded-md ${plain ? gradient : `bg-gradient-to-br ${gradient}`}`} />
      {label}
    </div>
  );
}

function MiniStat({ label, value, gradient }: { label: string; value: string; gradient: string }) {
  return (
    <div className={`rounded-xl bg-gradient-to-br ${gradient} p-3 text-white`}>
      <div className="text-[10px] text-white/80 font-bold uppercase">{label}</div>
      <div className="font-bold">{value}</div>
    </div>
  );
}
