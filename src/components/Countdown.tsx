import { useEffect, useState } from 'react';
import { daysUntilExam } from '../utils/stats';

export default function Countdown() {
  const [t, setT] = useState(daysUntilExam());

  useEffect(() => {
    const id = setInterval(() => setT(daysUntilExam()), 1_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="rounded-[18px] bg-white/95 px-5 py-4 flex items-center justify-between backdrop-blur-sm">
      <div>
        <div className="text-xs uppercase tracking-wide text-indigo-500 font-bold">GATE 2027</div>
        <div className="text-sm text-slate-600 mt-0.5">7 February 2027</div>
      </div>
      <div className="flex items-center gap-3 sm:gap-4">
        <TimeBlock value={t.days} label="days" />
        <TimeBlock value={t.hours} label="hrs" />
        <TimeBlock value={t.minutes} label="min" />
        <TimeBlock value={t.seconds} label="sec" />
      </div>
    </div>
  );
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center min-w-[42px]">
      <div className="text-2xl font-bold bg-gradient-to-br from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent tabular-nums">
        {value}
      </div>
      <div className="text-[10px] uppercase text-slate-400 font-semibold">{label}</div>
    </div>
  );
}
