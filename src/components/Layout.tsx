import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  ListChecks,
  BookOpen,
  Target,
  ClipboardList,
  AlertTriangle,
  BarChart3,
  Settings,
  GraduationCap,
  ChevronRight,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/tasks', label: 'All Tasks', icon: ListChecks },
  { to: '/subjects', label: 'Subjects', icon: BookOpen },
  { to: '/pyqs', label: 'PYQs', icon: Target },
  { to: '/tests', label: 'Tests', icon: ClipboardList },
  { to: '/errors', label: 'Error Log', icon: AlertTriangle },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/schedule', label: 'Edit Schedule', icon: Settings },
];

const colorMap: Record<
  string,
  {
    icon: string;
    active: string;
    dot: string;
  }
> = {
  indigo: {
    icon: 'text-indigo-600 bg-indigo-50',
    active: 'bg-indigo-50 text-indigo-700',
    dot: 'bg-indigo-500',
  },
  sky: {
    icon: 'text-sky-600 bg-sky-50',
    active: 'bg-sky-50 text-sky-700',
    dot: 'bg-sky-500',
  },
  emerald: {
    icon: 'text-emerald-600 bg-emerald-50',
    active: 'bg-emerald-50 text-emerald-700',
    dot: 'bg-emerald-500',
  },
  violet: {
    icon: 'text-violet-600 bg-violet-50',
    active: 'bg-violet-50 text-violet-700',
    dot: 'bg-violet-500',
  },
  amber: {
    icon: 'text-amber-600 bg-amber-50',
    active: 'bg-amber-50 text-amber-700',
    dot: 'bg-amber-500',
  },
  rose: {
    icon: 'text-rose-600 bg-rose-50',
    active: 'bg-rose-50 text-rose-700',
    dot: 'bg-rose-500',
  },
  orange: {
    icon: 'text-orange-600 bg-orange-50',
    active: 'bg-orange-50 text-orange-700',
    dot: 'bg-orange-500',
  },
  cyan: {
    icon: 'text-cyan-600 bg-cyan-50',
    active: 'bg-cyan-50 text-cyan-700',
    dot: 'bg-cyan-500',
  },
  slate: {
    icon: 'text-slate-600 bg-slate-100',
    active: 'bg-slate-100 text-slate-700',
    dot: 'bg-slate-500',
  },
};

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#f6f7fb]">

      {/* ================================================================ */}
      {/* DESKTOP SIDEBAR */}
      {/* ================================================================ */}

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] flex-col border-r border-slate-200 bg-white md:flex">

        {/* Brand */}
        <div className="relative overflow-hidden border-b border-slate-100 px-5 py-5">

          <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-indigo-100/70 blur-2xl" />
          <div className="absolute -bottom-8 left-12 h-20 w-20 rounded-full bg-violet-100/60 blur-2xl" />

          <div className="relative flex items-center gap-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-blue-600 text-white shadow-lg shadow-indigo-200/60">
              <GraduationCap size={23} strokeWidth={2} />
            </div>

            <div>
              <div className="text-[15px] font-bold tracking-tight text-slate-900">
                GATE CSE 2027
              </div>

              <div className="mt-0.5 text-[11px] font-medium text-slate-500">
                Preparation Tracker
              </div>
            </div>

          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-5">

          {/* Workspace */}
          <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Workspace
          </div>

          <nav className="space-y-1">
            {NAV_ITEMS.slice(0, 4).map((item, index) => (
              <SidebarItem
                key={item.to}
                item={item}
                color={['indigo', 'sky', 'emerald', 'violet'][index]}
              />
            ))}
          </nav>

          {/* Practice */}
          <div className="mb-2 mt-7 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Practice
          </div>

          <nav className="space-y-1">
            {NAV_ITEMS.slice(4, 7).map((item, index) => (
              <SidebarItem
                key={item.to}
                item={item}
                color={['amber', 'rose', 'orange'][index]}
              />
            ))}
          </nav>

          {/* Insights */}
          <div className="mb-2 mt-7 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Insights
          </div>

          <nav className="space-y-1">
            {NAV_ITEMS.slice(7).map((item, index) => (
              <SidebarItem
                key={item.to}
                item={item}
                color={['cyan', 'slate'][index]}
              />
            ))}
          </nav>
        </div>

        {/* Bottom motivation card */}
        <div className="p-3">

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-blue-600 p-4 text-white shadow-lg shadow-indigo-200/50">

            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10" />
            <div className="absolute -bottom-10 -left-6 h-20 w-20 rounded-full bg-white/10" />

            <div className="relative">

              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
                <Target size={16} />
              </div>

              <p className="text-xs font-bold">
                Stay consistent.
              </p>

              <p className="mt-1 text-[10px] leading-4 text-indigo-100">
                Small daily progress compounds into a strong rank.
              </p>

              <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/20">
                <div className="h-full w-2/3 rounded-full bg-white/80" />
              </div>

            </div>
          </div>

          <p className="px-2 pt-3 text-center text-[10px] text-slate-400">
            Your data stays in this browser.
          </p>

        </div>
      </aside>

      {/* ================================================================ */}
      {/* MAIN CONTENT */}
      {/* ================================================================ */}

      <main className="min-w-0 md:ml-[260px] pb-[76px] md:pb-0">
        <Outlet />
      </main>

      {/* ================================================================ */}
      {/* MOBILE NAVIGATION */}
      {/* ================================================================ */}

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200/80 bg-white/95 px-1 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_25px_rgba(15,23,42,0.07)] backdrop-blur-xl md:hidden">

        <div className="flex overflow-x-auto">

          {NAV_ITEMS.map((item, index) => {
            const colors = [
              'indigo',
              'sky',
              'emerald',
              'violet',
              'amber',
              'rose',
              'orange',
              'cyan',
              'slate',
            ];

            const color = colorMap[colors[index]];

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `group relative flex min-w-[70px] flex-1 flex-col items-center justify-center gap-1 px-2 py-2.5 text-[9px] font-medium transition ${
                    isActive
                      ? 'text-indigo-600'
                      : 'text-slate-500 hover:text-slate-800'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-1/2 top-0 h-0.5 w-10 -translate-x-1/2 rounded-full bg-indigo-600" />
                    )}

                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-xl transition ${
                        isActive
                          ? color.icon
                          : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                      }`}
                    >
                      <item.icon size={17} strokeWidth={2} />
                    </span>

                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}

        </div>
      </nav>
    </div>
  );
}


/* ====================================================================== */
/* SIDEBAR ITEM */
/* ====================================================================== */

function SidebarItem({
  item,
  color,
}: {
  item: (typeof NAV_ITEMS)[number];
  color: string;
}) {
  const Icon = item.icon;
  const colors = colorMap[color];

  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200 ${
          isActive
            ? `${colors.active} shadow-sm`
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span
              className={`absolute left-0 top-2.5 h-5 w-0.5 rounded-r-full ${colors.dot}`}
            />
          )}

          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${
              isActive
                ? colors.icon
                : 'bg-slate-50 text-slate-500 group-hover:bg-white group-hover:shadow-sm'
            }`}
          >
            <Icon
              size={17}
              strokeWidth={isActive ? 2.2 : 1.8}
            />
          </span>

          <span className="flex-1">
            {item.label}
          </span>

          {isActive && (
            <ChevronRight
              size={14}
              className="opacity-40"
            />
          )}
        </>
      )}
    </NavLink>
  );
}