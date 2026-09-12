import { useMemo } from 'react';
import { useData } from '../context/DataContext';
import {
  overallCompletionPct, totalStudyMinutes, totalPYQs, testStats, currentStreak,
  longestStreak, missedTasks, dayCompletionPct, formatMinutes, relevantTasks,
} from '../utils/stats';
import { subjectStats } from '../utils/stats';
import StatCard from '../components/StatCard';
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';

export default function Analytics() {
  const { state, tasks } = useData();
  const overall = overallCompletionPct(state, tasks);
  const minutes = totalStudyMinutes(state);
  const pyqs = totalPYQs(state);
  const tests = testStats(state);
  const streak = currentStreak(state, tasks);
  const longest = longestStreak(state, tasks);
  const missed = missedTasks(state, tasks);
  const partialCount = Object.values(state.progress).filter((p) => p.status === 'partial').length;
  const subjects = subjectStats(state, tasks);

  const dailyCompletion = useMemo(() => {
    const byDate = new Map<string, typeof tasks>();
    for (const t of relevantTasks(tasks)) {
      if (!byDate.has(t.date)) byDate.set(t.date, []);
      byDate.get(t.date)!.push(t);
    }
    return [...byDate.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([date, dayTasks]) => ({
      date, pct: dayCompletionPct(state, dayTasks),
    }));
  }, [tasks, state]);

  const studyHoursPerDay = useMemo(() => {
    const byDate = new Map<string, number>();
    for (const t of tasks) {
      const p = state.progress[t.id];
      if (!p) continue;
      byDate.set(t.date, (byDate.get(t.date) || 0) + p.actualStudyMinutes / 60);
    }
    return [...byDate.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([date, hours]) => ({ date, hours: Math.round(hours * 10) / 10 }));
  }, [tasks, state]);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 space-y-5">
      <h1 className="text-xl font-semibold text-[#1c2128]">Analytics</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Overall completion" value={`${overall}%`} />
        <StatCard label="Study hours logged" value={formatMinutes(minutes)} />
        <StatCard label="PYQ accuracy" value={`${pyqs.accuracy}%`} />
        <StatCard label="Test average" value={tests.count ? `${tests.average}%` : '—'} />
        <StatCard label="Current streak" value={`${streak}d`} />
        <StatCard label="Longest streak" value={`${longest}d`} />
        <StatCard label="Missed tasks" value={missed.length} />
        <StatCard label="Partially completed" value={partialCount} />
      </div>

      {dailyCompletion.length > 1 && (
        <ChartCard title="Daily completion %">
          <LineChart data={dailyCompletion}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="date" tick={{ fontSize: 9 }} hide={dailyCompletion.length > 25} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Line type="monotone" dataKey="pct" stroke="#8a3324" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartCard>
      )}

      {studyHoursPerDay.length > 1 && (
        <ChartCard title="Study hours per day">
          <BarChart data={studyHoursPerDay}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="date" tick={{ fontSize: 9 }} hide={studyHoursPerDay.length > 25} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="hours" fill="#8a3324" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ChartCard>
      )}

      <ChartCard title="Subject-wise progress">
        <BarChart data={subjects} layout="vertical" margin={{ left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
          <YAxis type="category" dataKey="subject" tick={{ fontSize: 10 }} width={90} />
          <Tooltip />
          <Bar dataKey="completionPct" fill="#8a3324" radius={[0, 3, 3, 0]} />
        </BarChart>
      </ChartCard>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactElement }) {
  return (
    <div className="rounded-xl border border-[#e4e1d8] bg-white p-4">
      <div className="text-sm font-medium mb-3">{title}</div>
      <ResponsiveContainer width="100%" height={240}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}
