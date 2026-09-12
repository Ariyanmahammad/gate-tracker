import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useData } from "../context/DataContext";
import { getTasksForDate, todayISO } from "../utils/tasks";
import {
  overallCompletionPct,
  dayCompletionPct,
  currentStreak,
  todayStudyMinutes,
  totalStudyMinutes,
  totalPYQs,
  testStats,
  formatMinutes,
  missedTasks,
} from "../utils/stats";
import Countdown from "../components/Countdown";
import TaskCard from "../components/TaskCard";
import { getDailyQuote } from "../utils/quote";

export default function Dashboard() {
  const { state, tasks } = useData();

  const today = todayISO();

  const todayTasks = useMemo(
    () => getTasksForDate(tasks, today),
    [tasks, today],
  );

  const daySessions = todayTasks.filter(
    (t) => t.session === "Day" || t.session === "Morning",
  );

  const nightSessions = todayTasks.filter(
    (t) => t.session === "Night" || t.session === "Night/Analysis",
  );

  const otherSessions = todayTasks.filter(
    (t) => !daySessions.includes(t) && !nightSessions.includes(t),
  );

  const overall = overallCompletionPct(state, tasks);
  const todayPct = dayCompletionPct(state, todayTasks);
  const streak = currentStreak(state, tasks);
  const minutes = todayStudyMinutes(state,tasks);
  const pyqs = totalPYQs(state);
  const tests = testStats(state);

  const missed = missedTasks(state, tasks).slice(0, 5);
  const recentMistakes = state.errorLog.slice(0, 3);

  const dateLabel = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const quote = getDailyQuote();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-violet-100/70">
      <div className="mx-auto max-w-7xl space-y-7 px-4 py-6 sm:px-6 md:py-8 lg:px-8">
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 shadow-sm shadow-indigo-300" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-600">
                GATE 2027
              </span>
            </div>

            <h1 className="bg-gradient-to-r from-indigo-700 via-violet-700 to-fuchsia-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent md:text-4xl">
              Dashboard
            </h1>

            <p className="mt-1 text-sm font-medium text-slate-500">
              {dateLabel}
            </p>

            <p className="mt-1 text-sm italic text-indigo-400/80">"{quote}"</p>
          </div>

          <Link
            to="/tasks"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:from-indigo-700 hover:to-violet-700 hover:shadow-xl"
          >
            Today's plan
            <span aria-hidden>→</span>
          </Link>
        </header>

        {/* Countdown */}
        <div className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 p-1 shadow-xl shadow-indigo-100">
          <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-24 left-20 h-56 w-56 rounded-full bg-purple-300/10 blur-3xl" />

          <div className="relative rounded-[20px] bg-white/10 p-1 backdrop-blur-sm">
            <Countdown />
          </div>
        </div>

        {/* Main progress */}
        <section className="grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
          {/* Overall */}
          <div className="relative overflow-hidden relative overflow-hidden rounded-3xl border border-indigo-200/70 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-6 text-white shadow-xl shadow-indigo-200/60 transition hover:-translate-y-0.5 hover:shadow-2xl md:p-7">
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 left-1/3 h-40 w-40 rounded-full bg-cyan-300/10 blur-3xl" />

            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-100">
                    Overall progress
                  </p>

                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="bg-gradient-to-r from-white via-cyan-100 to-fuchsia-100 bg-clip-text text-5xl font-bold tracking-tight text-transparent md:text-6xl">
                      {overall}%
                    </span>

                    <span className="text-sm font-medium text-indigo-100">
                      completed
                    </span>
                  </div>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white shadow-lg shadow-indigo-950/20 ring-1 ring-white/20 backdrop-blur-sm">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-7 w-7"
                  >
                    <path d="M5 12.5 9.5 17 19 7.5" />
                  </svg>
                </div>
              </div>

              <div className="mt-7 h-3 overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-white to-fuchsia-200 shadow-lg transition-all duration-700"
                  style={{ width: `${Math.min(overall, 100)}%` }}
                />
              </div>

              <div className="mt-2 flex justify-between text-[11px] font-semibold text-indigo-100">
                <span>GATE preparation</span>
                <span>{overall}%</span>
              </div>
            </div>
          </div>

          {/* Today's progress */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-600 via-blue-700 to-indigo-800 p-6 text-white shadow-xl shadow-indigo-100 md:p-7">
            <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-cyan-300/20 blur-3xl" />
            <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-fuchsia-300/20 blur-3xl" />

            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-100">
                Today's progress
              </p>

              <div className="mt-5 flex items-center gap-5">
                <ProgressRing value={todayPct} />

                <div>
                  <p className="text-3xl font-bold">{todayPct}%</p>

                  <p className="mt-1 text-sm text-blue-100">
                    {todayTasks.length} planned task
                    {todayTasks.length === 1 ? "" : "s"}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2 text-xs text-cyan-100">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Keep today's momentum going
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-800">
                Study overview
              </h2>
              <p className="mt-0.5 text-xs text-slate-400">
                Your preparation at a glance
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <MetricCard
              label="Current streak"
              value={`${streak}`}
              suffix="days"
              icon="🔥"
              gradient="from-orange-50 to-amber-50"
              iconBg="bg-orange-100"
            />

            <MetricCard
              label="Study time"
              value={formatMinutes(minutes)}
              icon="◷"
              gradient="from-blue-50 to-cyan-50"
              iconBg="bg-blue-100"
            />

            <MetricCard
              label="PYQs solved"
              value={`${pyqs.attempted}`}
              sub={`${pyqs.accuracy}% accuracy`}
              icon="✓"
              gradient="from-emerald-50 to-teal-50"
              iconBg="bg-emerald-100"
            />

            <MetricCard
              label="Avg test score"
              value={tests.count ? `${tests.average}%` : "—"}
              sub={tests.count ? `${tests.count} tests` : "No tests yet"}
              icon="↗"
              gradient="from-violet-50 to-purple-50"
              iconBg="bg-violet-100"
            />
          </div>
        </section>

        {/* Quick actions */}
        <section>
          <h2 className="mb-3 text-sm font-bold text-slate-800">
            Quick actions
          </h2>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <QuickAction
              to="/pyqs"
              title="Add PYQ"
              description="Record practice"
              icon="+"
              color="indigo"
            />

            <QuickAction
              to="/tests"
              title="Add test"
              description="Record score"
              icon="↗"
              color="violet"
            />

            <QuickAction
              to="/errors"
              title="Log error"
              description="Track weak areas"
              icon="!"
              color="rose"
            />

            <QuickAction
              to="/calendar"
              title="History"
              description="Review progress"
              icon="□"
              color="emerald"
            />
          </div>
        </section>

        {/* Today's tasks */}
        <section className="space-y-6">
          {daySessions.length > 0 && (
            <TaskSection
              title="Day session"
              count={daySessions.length}
              accent="morning"
            >
              {daySessions.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </TaskSection>
          )}

          {nightSessions.length > 0 && (
            <TaskSection
              title="Night session"
              count={nightSessions.length}
              accent="night"
            >
              {nightSessions.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </TaskSection>
          )}

          {otherSessions.length > 0 && (
            <TaskSection
              title="Other sessions"
              count={otherSessions.length}
              accent="other"
            >
              {otherSessions.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </TaskSection>
          )}

          {todayTasks.length === 0 && (
            <div className="rounded-3xl border border-dashed border-indigo-200 bg-gradient-to-br from-white via-indigo-50 to-violet-50 p-12 text-center shadow-lg shadow-indigo-100/50">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-xl text-indigo-500">
                □
              </div>

              <h3 className="mt-4 text-sm font-bold text-slate-700">
                No tasks planned today
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Nothing is scheduled for today in your study plan.
              </p>

              <Link
                to="/tasks"
                className="mt-4 inline-block text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
              >
                Open task planner →
              </Link>
            </div>
          )}
        </section>

        {/* Missed tasks */}
        {missed.length > 0 && (
          <TaskSection
            title="Missed / unsubmitted"
            count={missed.length}
            accent="warning"
          >
            {missed.map((task) => (
              <TaskCard key={task.id} task={task} showDate />
            ))}
          </TaskSection>
        )}

        {/* Recent mistakes */}
        {recentMistakes.length > 0 && (
          <section>
            <div className="mb-3 flex items-end justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-800">
                  Recent mistakes
                </h2>

                <p className="mt-0.5 text-xs text-slate-400">
                  Weak areas worth revisiting
                </p>
              </div>

              <Link
                to="/errors"
                className="text-xs font-semibold text-rose-500 hover:text-rose-600 hover:underline"
              >
                View all →
              </Link>
            </div>

            <div className="overflow-hidden rounded-3xl border border-rose-200/70 bg-gradient-to-br from-white via-rose-50/80 to-orange-50/80 shadow-lg shadow-rose-100/60">
              {recentMistakes.map((error, index) => (
                <div
                  key={error.id}
                  className={`p-4 transition hover:bg-rose-100/60 ${
                    index !== recentMistakes.length - 1
                      ? "border-b border-slate-100"
                      : ""
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-100 to-orange-100 text-sm font-bold text-rose-500">
                      !
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap gap-x-2 gap-y-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        <span>{error.date}</span>
                        <span>·</span>
                        <span>{error.subject}</span>
                      </div>

                      <p className="mt-1 text-sm leading-5 text-slate-700">
                        {error.mistake}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Small UI components                                                        */
/* -------------------------------------------------------------------------- */

function MetricCard({
  label,
  value,
  suffix,
  sub,
  icon,
  gradient,
  iconBg,
}: {
  label: string;
  value: string;
  suffix?: string;
  sub?: string;
  icon: string;
  gradient: string;
  iconBg: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/60 bg-gradient-to-br ${gradient} p-4 shadow-lg shadow-slate-200/60 transition duration-200 hover:-translate-y-1 hover:shadow-xl`}
    >
      <div className="flex items-start justify-between">
        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
          {label}
        </p>

        <span
          className={`flex h-8 w-8 items-center justify-center rounded-xl ${iconBg} text-sm font-bold text-slate-800 shadow-sm ring-1 ring-black/5`}
        >
          {icon}
        </span>
      </div>

      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-xl font-bold tracking-tight text-slate-800 md:text-2xl">
          {value}
        </span>

        {suffix && (
          <span className="text-xs font-medium text-slate-500">{suffix}</span>
        )}
      </div>

      {sub && (
        <p className="mt-1 text-[11px] font-medium text-slate-500">{sub}</p>
      )}
    </div>
  );
}

function QuickAction({
  to,
  title,
  description,
  icon,
  color,
}: {
  to: string;
  title: string;
  description: string;
  icon: string;
  color: "indigo" | "violet" | "rose" | "emerald";
}) {
  const colors = {
    indigo: {
      bg: "bg-indigo-50",
      text: "text-indigo-600",
      hover: "group-hover:bg-indigo-100",
    },
    violet: {
      bg: "bg-violet-50",
      text: "text-violet-600",
      hover: "group-hover:bg-violet-100",
    },
    rose: {
      bg: "bg-rose-50",
      text: "text-rose-600",
      hover: "group-hover:bg-rose-100",
    },
    emerald: {
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      hover: "group-hover:bg-emerald-100",
    },
  };

  const c = colors[color];

  return (
    <Link
      to={to}
      className="group flex items-center gap-3 rounded-2xl border border-white/70 bg-gradient-to-br from-white/90 to-indigo-50/90 px-3.5 py-3.5 shadow-lg shadow-indigo-100/50 transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl"
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${c.bg} ${c.text} text-sm font-bold transition ${c.hover}`}
      >
        {icon}
      </span>

      <span className="min-w-0">
        <span className="block text-xs font-bold text-slate-700">{title}</span>

        <span className="block truncate text-[10px] text-slate-400">
          {description}
        </span>
      </span>
    </Link>
  );
}

function TaskSection({
  title,
  count,
  accent,
  children,
}: {
  title: string;
  count: number;
  accent: "morning" | "night" | "other" | "warning";
  children: React.ReactNode;
}) {
  const accentClasses = {
    morning: "bg-emerald-50 text-emerald-700 border-emerald-100",
    night: "bg-indigo-50 text-indigo-700 border-indigo-100",
    other: "bg-amber-50 text-amber-700 border-amber-100",
    warning: "bg-rose-50 text-rose-700 border-rose-100",
  };

  const dotClasses = {
    morning: "bg-emerald-500",
    night: "bg-indigo-500",
    other: "bg-amber-500",
    warning: "bg-rose-500",
  };

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span
            className={`h-2.5 w-2.5 rounded-full ${dotClasses[accent]} shadow-sm`}
          />

          <h2 className="text-sm font-bold text-slate-800">{title}</h2>

          <span
            className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${accentClasses[accent]}`}
          >
            {count}
          </span>
        </div>
      </div>

      <div
        className={`space-y-2.5 rounded-3xl p-2.5 ${
          accent === "morning"
            ? "bg-gradient-to-br from-emerald-50/80 to-cyan-50/70"
            : accent === "night"
              ? "bg-gradient-to-br from-indigo-50/90 to-violet-50/80"
              : accent === "other"
                ? "bg-gradient-to-br from-amber-50/90 to-orange-50/70"
                : "bg-gradient-to-br from-rose-50/90 to-orange-50/70"
        }`}
      >
        {children}
      </div>
    </section>
  );
}

function ProgressRing({ value }: { value: number }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;

  const offset = circumference - (Math.min(value, 100) / 100) * circumference;

  return (
    <div className="relative h-[78px] w-[78px]">
      <svg viewBox="0 0 72 72" className="h-full w-full -rotate-90">
        <circle
          cx="36"
          cy="36"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          className="text-white/10"
        />

        <circle
          cx="36"
          cy="36"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-emerald-400 transition-all duration-700"
        />
      </svg>

      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
        {value}%
      </span>
    </div>
  );
}
