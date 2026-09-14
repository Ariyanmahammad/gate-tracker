import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, CalendarDays, ListChecks, BookOpen, Target,
  ClipboardList, AlertTriangle, BarChart3, Settings, GraduationCap, Sparkles,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/tasks', label: 'All Tasks', icon: ListChecks },
  { to: '/subjects', label: 'Subjects', icon: BookOpen },
  { to: '/pyqs', label: 'PYQs', icon: Target },
  { to: '/tests', label: 'Tests', icon: ClipboardList },
  { to: '/revision', label: 'Quick Revision', icon: Sparkles },
  { to: '/errors', label: 'Error Log', icon: AlertTriangle },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/schedule', label: 'Edit Schedule', icon: Settings },
];

export default function Layout() {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-50 via-sky-50 to-violet-100/70">
      <aside className="hidden md:flex md:flex-col w-64 shrink-0 bg-gradient-to-b from-indigo-700 via-violet-700 to-fuchsia-700 sticky top-0 h-screen shadow-xl">
        <div className="px-5 py-6 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-sm">
            <GraduationCap size={20} className="text-white" />
          </div>
          <div>
            <div className="font-bold text-[15px] leading-tight text-white">GATE CSE 2027</div>
            <div className="text-[11px] text-indigo-200">Preparation Tracker</div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-2 px-2">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm mb-1 transition-all ${
                  isActive
                    ? 'bg-white text-indigo-700 font-semibold shadow-lg'
                    : 'text-indigo-100 hover:bg-white/10'
                }`
              }
            >
              <item.icon size={17} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-4 text-[11px] text-indigo-200/80 border-t border-white/10">
          Your data stays in this browser.
        </div>
      </aside>

      <div className="flex-1 min-w-0 pb-16 md:pb-0">
        <Outlet />
      </div>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-indigo-700 via-violet-700 to-fuchsia-700 flex overflow-x-auto z-30 shadow-[0_-4px_16px_rgba(79,70,229,0.25)]">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 py-2 px-3 min-w-[64px] text-[10px] shrink-0 ${
                isActive ? 'text-white font-semibold' : 'text-indigo-200'
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
