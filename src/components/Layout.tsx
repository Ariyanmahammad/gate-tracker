import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, CalendarDays, ListChecks, BookOpen, Target,
  ClipboardList, AlertTriangle, BarChart3, Settings, GraduationCap,
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

export default function Layout() {
  return (
    <div className="min-h-screen flex bg-[#f6f5f1]">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col w-60 shrink-0 border-r border-[#e4e1d8] bg-[#fbfaf7] sticky top-0 h-screen">
        <div className="px-5 py-5 border-b border-[#e4e1d8] flex items-center gap-2">
          <GraduationCap size={22} className="text-[#8a3324]" />
          <div>
            <div className="font-semibold text-[15px] leading-tight text-[#1c2128]">GATE CSE 2027</div>
            <div className="text-[11px] text-[#8a8677]">Prep Tracker</div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-3">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 mx-2 px-3 py-2 rounded-lg text-sm mb-0.5 transition-colors ${
                  isActive
                    ? 'bg-[#8a3324] text-white'
                    : 'text-[#4a4638] hover:bg-[#efece2]'
                }`
              }
            >
              <item.icon size={17} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-3 text-[11px] text-[#a39d8a] border-t border-[#e4e1d8]">
          Data is stored locally in this browser.
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 pb-16 md:pb-0">
        <Outlet />
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#fbfaf7] border-t border-[#e4e1d8] flex overflow-x-auto z-30">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 py-2 px-3 min-w-[64px] text-[10px] shrink-0 ${
                isActive ? 'text-[#8a3324]' : 'text-[#8a8677]'
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
