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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 space-y-5">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-600">Practice</span>
          <h1 className="bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-3xl font-bold text-transparent">PYQ Tracker</h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Attempted" value={totals.attempted} gradient="from-emerald-500 to-teal-600" />
          <StatCard label="Correct" value={totals.correct} gradient="from-cyan-500 to-blue-600" />
          <StatCard label="Wrong" value={totals.wrong} gradient="from-rose-500 to-red-600" />
          <StatCard label="Accuracy" value={`${totals.accuracy}%`} gradient="from-fuchsia-500 to-pink-600" />
        </div>

        {overTime.length > 0 && (
          <div className="rounded-3xl bg-white/90 backdrop-blur-sm shadow-lg shadow-emerald-100/50 p-5">
            <div className="text-sm font-bold text-slate-700 mb-3">PYQs solved over time</div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={overTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ecfdf5" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} hide={overTime.length > 20} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #d1fae5' }} />
                <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        <div>
          <div className="text-sm font-bold text-slate-700 mb-2">By Subject</div>
          <div className="space-y-2">
            {bySubject.length === 0 && <div className="text-sm text-slate-400">No PYQ data submitted yet. Submit progress on a task to log PYQs.</div>}
            {bySubject.map((s) => (
              <div key={s.subject} className="rounded-2xl bg-white/90 backdrop-blur-sm shadow-md shadow-emerald-100/40 p-3.5 flex items-center justify-between">
                <div className="font-bold text-sm text-slate-700">{s.subject}</div>
                <div className="text-xs text-emerald-600 font-semibold">{s.attempted} attempted · {s.accuracy}% accuracy</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
