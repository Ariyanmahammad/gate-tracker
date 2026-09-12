import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { getTasksForDate, todayISO } from '../utils/tasks';
import {
  overallCompletionPct, dayCompletionPct, currentStreak, totalStudyMinutes,
  totalPYQs, testStats, formatMinutes, missedTasks,
} from '../utils/stats';
import Countdown from '../components/Countdown';
import StatCard from '../components/StatCard';
import TaskCard from '../components/TaskCard';

export default function Dashboard() {
  const { state, tasks } = useData();
  const today = todayISO();
  const todayTasks = useMemo(() => getTasksForDate(tasks, today), [tasks, today]);
  const daySessions = todayTasks.filter((t) => t.session === 'Day' || t.session === 'Morning');
  const nightSessions = todayTasks.filter((t) => t.session === 'Night' || t.session === 'Night/Analysis');
  const otherSessions = todayTasks.filter((t) => !daySessions.includes(t) && !nightSessions.includes(t));

  const overall = overallCompletionPct(state, tasks);
  const todayPct = dayCompletionPct(state, todayTasks);
  const streak = currentStreak(state, tasks);
  const minutes = totalStudyMinutes(state);
  const pyqs = totalPYQs(state);
  const tests = testStats(state);
  const missed = missedTasks(state, tasks).slice(0, 5);
  const recentMistakes = state.errorLog.slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-[#1c2128]">Dashboard</h1>
        <p className="text-sm text-[#8a8677]">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <Countdown />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Overall completion" value={`${overall}%`} />
        <StatCard label="Today's completion" value={`${todayPct}%`} />
        <StatCard label="Current streak" value={`${streak} days`} />
        <StatCard label="Total study time" value={formatMinutes(minutes)} />
        <StatCard label="PYQs solved" value={pyqs.attempted} sub={`${pyqs.accuracy}% accuracy`} />
        <StatCard label="Avg test score" value={tests.count ? `${tests.average}%` : '—'} sub={tests.count ? `${tests.count} tests` : 'No tests yet'} />
      </div>

      <div className="flex flex-wrap gap-2">
        <Link to="/tasks" className="text-xs px-3 py-1.5 rounded-lg border border-[#ddd8ca] bg-white">View Today's Plan</Link>
        <Link to="/calendar" className="text-xs px-3 py-1.5 rounded-lg border border-[#ddd8ca] bg-white">View History</Link>
        <Link to="/pyqs" className="text-xs px-3 py-1.5 rounded-lg border border-[#ddd8ca] bg-white">+ Add PYQ Result</Link>
        <Link to="/tests" className="text-xs px-3 py-1.5 rounded-lg border border-[#ddd8ca] bg-white">+ Add Test Result</Link>
        <Link to="/errors" className="text-xs px-3 py-1.5 rounded-lg border border-[#ddd8ca] bg-white">+ Add Error</Link>
      </div>

      {daySessions.length > 0 && (
        <Section title="Day Session">
          {daySessions.map((t) => <TaskCard key={t.id} task={t} />)}
        </Section>
      )}
      {nightSessions.length > 0 && (
        <Section title="Night Session">
          {nightSessions.map((t) => <TaskCard key={t.id} task={t} />)}
        </Section>
      )}
      {otherSessions.length > 0 && (
        <Section title="Other Sessions">
          {otherSessions.map((t) => <TaskCard key={t.id} task={t} />)}
        </Section>
      )}
      {todayTasks.length === 0 && (
        <div className="text-sm text-[#8a8677] border border-dashed border-[#ddd8ca] rounded-xl p-6 text-center">
          No planned tasks found for today in the schedule.
        </div>
      )}

      {missed.length > 0 && (
        <Section title="Missed / Unsubmitted Tasks">
          {missed.map((t) => <TaskCard key={t.id} task={t} showDate />)}
        </Section>
      )}

      {recentMistakes.length > 0 && (
        <Section title="Recent Mistakes / Weak Areas">
          <div className="space-y-2">
            {recentMistakes.map((e) => (
              <div key={e.id} className="rounded-xl border border-[#e4e1d8] bg-white p-3 text-sm">
                <div className="text-[11px] text-[#8a8677] uppercase">{e.date} · {e.subject}</div>
                <div className="text-[#1c2128]">{e.mistake}</div>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-[#4a4638] mb-2">{title}</h2>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
