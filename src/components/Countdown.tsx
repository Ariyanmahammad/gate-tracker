import { useEffect, useState } from 'react';
import { daysUntilExam } from '../utils/stats';

export default function Countdown() {
  const [t, setT] = useState(daysUntilExam());

  useEffect(() => {
    const id = setInterval(() => setT(daysUntilExam()), 1_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="rounded-xl border border-[#e4e1d8] bg-[#fbfaf7] px-5 py-4 flex items-center justify-between">
      <div>
        <div className="text-xs uppercase tracking-wide text-[#8a8677] font-medium">GATE 2027</div>
        <div className="text-sm text-[#4a4638] mt-0.5">7 February 2027</div>
      </div>
      <div className="flex items-center gap-4">
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
    <div className="text-center">
      <div className="text-2xl font-semibold text-[#8a3324] tabular-nums">{value}</div>
      <div className="text-[10px] uppercase text-[#a39d8a]">{label}</div>
    </div>
  );
}
