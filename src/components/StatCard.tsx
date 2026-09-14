const GRADIENTS = [
  'from-indigo-500 to-violet-600',
  'from-cyan-500 to-blue-600',
  'from-emerald-500 to-teal-600',
  'from-fuchsia-500 to-pink-600',
  'from-orange-500 to-amber-600',
  'from-rose-500 to-red-600',
];

function gradientForLabel(label: string): string {
  let hash = 0;
  for (let i = 0; i < label.length; i++) hash = (hash * 31 + label.charCodeAt(i)) >>> 0;
  return GRADIENTS[hash % GRADIENTS.length];
}

export default function StatCard({
  label, value, sub, gradient,
}: { label: string; value: string | number; sub?: string; gradient?: string }) {
  const g = gradient || gradientForLabel(label);
  return (
    <div className={`rounded-2xl bg-gradient-to-br ${g} px-4 py-3.5 text-white shadow-lg shadow-indigo-100 transition hover:-translate-y-1`}>
      <div className="text-[10px] uppercase tracking-wide text-white/80 font-bold">{label}</div>
      <div className="text-xl font-bold mt-0.5">{value}</div>
      {sub && <div className="text-[11px] text-white/75 mt-0.5">{sub}</div>}
    </div>
  );
}
