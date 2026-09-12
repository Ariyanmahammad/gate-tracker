import { useData } from '../context/DataContext';
import { subjectStats } from '../utils/stats';

export default function Subjects() {
  const { state, tasks } = useData();
  const stats = subjectStats(state, tasks);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 space-y-4">
      <h1 className="text-xl font-semibold text-[#1c2128]">Subject Progress</h1>
      <div className="space-y-3">
        {stats.map((s) => (
          <div key={s.subject} className="rounded-xl border border-[#e4e1d8] bg-white p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium text-[#1c2128]">{s.subject}</div>
              <div className="text-sm text-[#8a8677]">{s.completionPct}%</div>
            </div>
            <div className="w-full h-2 rounded-full bg-[#eeece3] overflow-hidden mb-3">
              <div className="h-full bg-[#8a3324]" style={{ width: `${s.completionPct}%` }} />
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
        ))}
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="font-semibold text-[#1c2128]">{value}</div>
      <div className="text-[10px] text-[#a39d8a]">{label}</div>
    </div>
  );
}
