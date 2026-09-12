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
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 space-y-5">
      <h1 className="text-xl font-semibold text-[#1c2128]">Test Tracker</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Tests taken" value={stats.count} />
        <StatCard label="Best score" value={stats.count ? `${stats.best}%` : '—'} />
        <StatCard label="Average score" value={stats.count ? `${stats.average}%` : '—'} />
        <StatCard label="Average accuracy" value={stats.count ? `${stats.avgAccuracy}%` : '—'} />
      </div>

      {chartData.length > 1 && (
        <div className="rounded-xl border border-[#e4e1d8] bg-white p-4">
          <div className="text-sm font-medium mb-3">Score trend</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="pct" stroke="#8a3324" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="space-y-2">
        {rows.length === 0 && <div className="text-sm text-[#8a8677]">No tests logged yet — mark "Test taken" when submitting progress on a mock/test task.</div>}
        {rows.map(({ task, p }) => (
          <div key={task.id} className="rounded-xl border border-[#e4e1d8] bg-white p-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-[11px] uppercase text-[#8a8677]">{task.date}</div>
                <div className="font-medium text-sm">{p!.test.testName || task.topic}</div>
              </div>
              {p!.test.totalMarks ? (
                <div className="text-sm font-semibold">{p!.test.marksObtained}/{p!.test.totalMarks}</div>
              ) : null}
            </div>
            <div className="text-xs text-[#8a8677] mt-1">
              {p!.test.correct ?? 0} correct · {p!.test.wrong ?? 0} wrong · {p!.test.unattempted ?? 0} unattempted
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
