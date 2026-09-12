import { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { totalPYQs } from '../utils/stats';
import StatCard from '../components/StatCard';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';

export default function PYQs() {
  const { state, tasks } = useData();
  const totals = totalPYQs(state);

  const bySubject = useMemo(() => {
    const map = new Map<string, { attempted: number; correct: number }>();
    for (const t of tasks) {
      const p = state.progress[t.id];
      if (!p || !p.pyqsAttempted) continue;
      const cur = map.get(t.subject) || { attempted: 0, correct: 0 };
      cur.attempted += p.pyqsAttempted;
      cur.correct += p.pyqsCorrect;
      map.set(t.subject, cur);
    }
    return [...map.entries()].map(([subject, v]) => ({ subject, ...v, accuracy: v.attempted ? Math.round((v.correct / v.attempted) * 100) : 0 }))
      .sort((a, b) => b.attempted - a.attempted);
  }, [tasks, state]);

  const overTime = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of tasks) {
      const p = state.progress[t.id];
      if (!p || !p.pyqsAttempted) continue;
      map.set(t.date, (map.get(t.date) || 0) + p.pyqsAttempted);
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([date, count]) => ({ date, count }));
  }, [tasks, state]);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 space-y-5">
      <h1 className="text-xl font-semibold text-[#1c2128]">PYQ Tracker</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Attempted" value={totals.attempted} />
        <StatCard label="Correct" value={totals.correct} />
        <StatCard label="Wrong" value={totals.wrong} />
        <StatCard label="Accuracy" value={`${totals.accuracy}%`} />
      </div>

      {overTime.length > 0 && (
        <div className="rounded-xl border border-[#e4e1d8] bg-white p-4">
          <div className="text-sm font-medium mb-3">PYQs solved over time</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={overTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} hide={overTime.length > 20} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#8a3324" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div>
        <div className="text-sm font-semibold text-[#4a4638] mb-2">By Subject</div>
        <div className="space-y-2">
          {bySubject.length === 0 && <div className="text-sm text-[#8a8677]">No PYQ data submitted yet. Submit progress on a task to log PYQs.</div>}
          {bySubject.map((s) => (
            <div key={s.subject} className="rounded-xl border border-[#e4e1d8] bg-white p-3 flex items-center justify-between">
              <div className="font-medium text-sm">{s.subject}</div>
              <div className="text-xs text-[#8a8677]">{s.attempted} attempted · {s.accuracy}% accuracy</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
