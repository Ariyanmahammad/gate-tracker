import { useMemo } from 'react';
import { useData } from '../context/DataContext';
import {
  overallCompletionPct, totalStudyMinutes, totalPYQs, testStats, prepStreak,
  longestStreak, missedTasks, dayCompletionPct, formatMinutes, relevantTasks,
} from '../utils/stats';
import { subjectStats } from '../utils/stats';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#d946ef', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e'];

export default function Analytics() {
  const { state, tasks } = useData();
  const overall = overallCompletionPct(state, tasks);
  const minutes = totalStudyMinutes(state);
  const pyqs = totalPYQs(state);
  const tests = testStats(state);
  const streak = prepStreak();
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
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-indigo-50 to-cyan-50">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-600">Insights</span>
          <h1 className="bg-gradient-to-r from-indigo-700 via-violet-700 to-fuchsia-600 bg-clip-text text-3xl font-bold text-transparent">Analytics</h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <GlassStat label="Overall completion" value={`${overall}%`} gradient="from-indigo-500 to-violet-600" />
          <GlassStat label="Study hours logged" value={formatMinutes(minutes)} gradient="from-cyan-500 to-blue-600" />
          <GlassStat label="PYQ accuracy" value={`${pyqs.accuracy}%`} gradient="from-emerald-500 to-teal-600" />
          <GlassStat label="Test average" value={tests.count ? `${tests.average}%` : '—'} gradient="from-fuchsia-500 to-pink-600" />
          <GlassStat label="Current streak" value={`${streak}d`} gradient="from-orange-500 to-amber-600" />
          <GlassStat label="Longest good-day streak" value={`${longest}d`} gradient="from-rose-500 to-red-600" />
          <GlassStat label="Missed tasks" value={`${missed.length}`} gradient="from-slate-500 to-slate-700" />
          <GlassStat label="Partially completed" value={`${partialCount}`} gradient="from-violet-500 to-purple-700" />
        </div>

        {dailyCompletion.length > 1 && (
          <ChartCard title="Daily completion %" accent="from-indigo-500 to-violet-600">
            <LineChart data={dailyCompletion}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2ff" />
              <XAxis dataKey="date" tick={{ fontSize: 9 }} hide={dailyCompletion.length > 25} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e0e7ff' }} />
              <Line type="monotone" dataKey="pct" stroke="#8b5cf6" strokeWidth={3} dot={false} />
            </LineChart>
          </ChartCard>
        )}

        {studyHoursPerDay.length > 1 && (
          <ChartCard title="Study hours per day" accent="from-cyan-500 to-blue-600">
            <BarChart data={studyHoursPerDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ecfeff" />
              <XAxis dataKey="date" tick={{ fontSize: 9 }} hide={studyHoursPerDay.length > 25} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #cffafe' }} />
              <Bar dataKey="hours" fill="#06b6d4" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ChartCard>
        )}

        <ChartCard title="Subject-wise progress" accent="from-fuchsia-500 to-pink-600">
          <BarChart data={subjects} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#fdf4ff" />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="subject" tick={{ fontSize: 10 }} width={90} />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #fae8ff' }} />
            <Bar dataKey="completionPct" radius={[0, 6, 6, 0]}>
              {subjects.map((_, i) => <Bar key={i} fill={COLORS[i % COLORS.length]} dataKey="completionPct" />)}
            </Bar>
          </BarChart>
        </ChartCard>
      </div>
    </div>
  );
}

function GlassStat({ label, value, gradient }: { label: string; value: string; gradient: string }) {
  return (
    <div className={`rounded-2xl bg-gradient-to-br ${gradient} p-4 text-white shadow-lg shadow-indigo-100 transition hover:-translate-y-1`}>
      <div className="text-[10px] uppercase tracking-wide font-bold text-white/80">{label}</div>
      <div className="text-xl font-bold mt-1">{value}</div>
    </div>
  );
}

function ChartCard({ title, children, accent }: { title: string; children: React.ReactElement; accent: string }) {
  return (
    <div className="rounded-3xl border border-white bg-white/80 backdrop-blur-sm p-5 shadow-lg shadow-indigo-100/50">
      <div className="flex items-center gap-2 mb-3">
        <span className={`h-2.5 w-2.5 rounded-full bg-gradient-to-r ${accent}`} />
        <div className="text-sm font-bold text-slate-700">{title}</div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}
