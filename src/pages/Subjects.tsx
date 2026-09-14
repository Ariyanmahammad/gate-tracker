import { useData } from '../context/DataContext';
import { subjectStats } from '../utils/stats';

const GRADIENTS = [
  'from-indigo-500 to-violet-600', 'from-cyan-500 to-blue-600', 'from-emerald-500 to-teal-600',
  'from-fuchsia-500 to-pink-600', 'from-orange-500 to-amber-600', 'from-rose-500 to-red-600',
  'from-sky-500 to-indigo-600', 'from-lime-500 to-green-600',
];

export default function Subjects() {
  const { state, tasks } = useData();
  const stats = subjectStats(state, tasks);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 space-y-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-teal-600">By Subject</span>
          <h1 className="bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text text-3xl font-bold text-transparent">Subject Progress</h1>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {stats.map((s, i) => {
            const gradient = GRADIENTS[i % GRADIENTS.length];
            return (
              <div key={s.subject} className="rounded-3xl bg-white/90 backdrop-blur-sm shadow-lg shadow-indigo-100/50 p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold text-slate-800">{s.subject}</div>
                  <div className={`text-sm font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>{s.completionPct}%</div>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden mb-3">
                  <div className={`h-full rounded-full bg-gradient-to-r ${gradient}`} style={{ width: `${s.completionPct}%` }} />
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
                  <MiniStat label="Planned" value={s.totalTasks} />
                  <MiniStat label="Completed" value={s.completed} />
                  <MiniStat label="Partial" value={s.partial} />
                  <MiniStat label="Skipped" value={s.skipped} />
                  <MiniStat label="PYQs" value={s.pyqsSolved} />
                  <MiniStat label="Hours" value={s.studyHours} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-slate-50 rounded-lg py-1.5">
      <div className="font-bold text-slate-700">{value}</div>
      <div className="text-[9px] text-slate-400 uppercase font-semibold">{label}</div>
    </div>
  );
}
