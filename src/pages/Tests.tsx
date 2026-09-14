import { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { testStats } from '../utils/stats';
import StatCard from '../components/StatCard';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function Tests() {
  const { state, tasks } = useData();
  const stats = testStats(state);

  const rows = useMemo(() => {
    return tasks
      .map((t) => ({ task: t, p: state.progress[t.id] }))
      .filter((r) => r.p?.test?.taken)
      .sort((a, b) => a.task.date.localeCompare(b.task.date));
  }, [tasks, state]);

  const chartData = rows
    .filter((r) => r.p!.test.totalMarks)
    .map((r) => ({
      date: r.task.date,
      pct: Math.round(((r.p!.test.marksObtained || 0) / (r.p!.test.totalMarks || 1)) * 100),
    }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-fuchsia-50 to-pink-50">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 space-y-5">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-fuchsia-600">Mocks</span>
          <h1 className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-3xl font-bold text-transparent">Test Tracker</h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Tests taken" value={stats.count} gradient="from-violet-500 to-purple-600" />
          <StatCard label="Best score" value={stats.count ? `${stats.best}%` : '—'} gradient="from-fuchsia-500 to-pink-600" />
          <StatCard label="Average score" value={stats.count ? `${stats.average}%` : '—'} gradient="from-indigo-500 to-violet-600" />
          <StatCard label="Average accuracy" value={stats.count ? `${stats.avgAccuracy}%` : '—'} gradient="from-rose-500 to-red-600" />
        </div>

        {chartData.length > 1 && (
          <div className="rounded-3xl bg-white/90 backdrop-blur-sm shadow-lg shadow-fuchsia-100/50 p-5">
            <div className="text-sm font-bold text-slate-700 mb-3">Score trend</div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fdf4ff" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #fae8ff' }} />
                <Line type="monotone" dataKey="pct" stroke="#c026d3" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="space-y-2">
          {rows.length === 0 && <div className="text-sm text-slate-400">No tests logged yet — mark "Test taken" when submitting progress on a mock/test task.</div>}
          {rows.map(({ task, p }) => (
            <div key={task.id} className="rounded-2xl bg-white/90 backdrop-blur-sm shadow-md shadow-fuchsia-100/40 p-3.5">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-[11px] uppercase text-fuchsia-500 font-bold">{task.date}</div>
                  <div className="font-bold text-sm text-slate-700">{p!.test.testName || task.topic}</div>
                </div>
                {p!.test.totalMarks ? (
                  <div className="text-sm font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">{p!.test.marksObtained}/{p!.test.totalMarks}</div>
                ) : null}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {p!.test.correct ?? 0} correct · {p!.test.wrong ?? 0} wrong · {p!.test.unattempted ?? 0} unattempted
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
