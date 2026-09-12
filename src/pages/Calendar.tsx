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
    if (dayTasks.length === 0) return 'bg-transparent text-[#c9c5b7]';
    if (!isPastOrToday(date)) return 'bg-[#eef0f5] text-[#7c86a3]';
    const submitted = dayTasks.some((t) => state.progress[t.id]);
    if (!submitted) return 'bg-[#eeece3] text-[#8a8677]';
    const pct = dayCompletionPct(state, dayTasks);
    if (pct >= 75) return 'bg-[#cfe8d8] text-[#215c39]';
    if (pct >= 40) return 'bg-[#fbe6a8] text-[#7a5c00]';
    return 'bg-[#f3c9c9] text-[#8a2f2f]';
  }

  const selectedTasks = selected ? getTasksForDate(tasks, selected) : [];
  const selectedMinutes = selectedTasks.reduce((sum, t) => sum + (state.progress[t.id]?.actualStudyMinutes || 0), 0);
  const selectedPyqs = selectedTasks.reduce((sum, t) => sum + (state.progress[t.id]?.pyqsAttempted || 0), 0);
  const selectedCorrect = selectedTasks.reduce((sum, t) => sum + (state.progress[t.id]?.pyqsCorrect || 0), 0);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 space-y-5">
      <h1 className="text-xl font-semibold text-[#1c2128]">Calendar &amp; History</h1>

      <div className="flex items-center justify-between">
        <button onClick={() => setMonthCursor(new Date(year, month - 1, 1))} className="px-2 py-1 rounded-lg border border-[#ddd8ca] text-sm">‹</button>
        <div className="font-medium text-sm">{monthCursor.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</div>
        <button onClick={() => setMonthCursor(new Date(year, month + 1, 1))} className="px-2 py-1 rounded-lg border border-[#ddd8ca] text-sm">›</button>
      </div>

      <div className="grid grid-cols-7 gap-1.5 text-center">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i} className="text-[11px] text-[#a39d8a] font-medium">{d}</div>
        ))}
        {cells.map((date, i) =>
          date ? (
            <button
              key={i}
              onClick={() => setSelected(date)}
              className={`aspect-square rounded-lg text-xs font-medium flex items-center justify-center ${colorFor(date)} ${selected === date ? 'ring-2 ring-[#8a3324]' : ''}`}
            >
              {Number(date.split('-')[2])}
            </button>
          ) : (
            <div key={i} />
          )
        )}
      </div>

      <div className="flex gap-3 text-[11px] text-[#8a8677] flex-wrap">
        <Legend color="bg-[#cfe8d8]" label="Completed well" />
        <Legend color="bg-[#fbe6a8]" label="Partial" />
        <Legend color="bg-[#f3c9c9]" label="Poor / missed" />
        <Legend color="bg-[#eeece3]" label="Not yet attempted" />
        <Legend color="bg-[#eef0f5]" label="Upcoming" />
      </div>

      {selected && (
        <div className="rounded-xl border border-[#e4e1d8] bg-white p-4 space-y-3">
          <div className="font-semibold text-[#1c2128]">{selected}</div>
          {selectedTasks.length === 0 ? (
            <div className="text-sm text-[#8a8677]">No planned tasks for this date.</div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                <div><div className="text-[11px] text-[#8a8677]">Day completion</div><div className="font-medium">{dayCompletionPct(state, selectedTasks)}%</div></div>
                <div><div className="text-[11px] text-[#8a8677]">Study time</div><div className="font-medium">{formatMinutes(selectedMinutes)}</div></div>
                <div><div className="text-[11px] text-[#8a8677]">PYQs</div><div className="font-medium">{selectedPyqs}</div></div>
                <div><div className="text-[11px] text-[#8a8677]">Accuracy</div><div className="font-medium">{selectedPyqs ? Math.round((selectedCorrect / selectedPyqs) * 100) : 0}%</div></div>
              </div>
              <div className="space-y-2">
                {selectedTasks.map((t) => {
                  const p = state.progress[t.id];
                  const status = getTaskStatus(state, t.id);
                  const pct = getCompletionPct(state, t.id);
                  return (
                    <div key={t.id} className="border border-[#eee] rounded-lg p-3">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <div className="text-[11px] uppercase text-[#8a8677]">{t.session} · {t.subject}</div>
                          <div className="text-sm">{t.topic}</div>
                        </div>
                        <StatusBadge status={status} pct={pct} />
                      </div>
                      {p?.mistakes && <div className="text-xs text-[#a13a3a] mt-2">Weak area: {p.mistakes}</div>}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-2.5 h-2.5 rounded-sm ${color}`} />
      {label}
    </div>
  );
}
