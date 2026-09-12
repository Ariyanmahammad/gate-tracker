export default function StatCard({
  label, value, sub,
}: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-[#e4e1d8] bg-[#fbfaf7] px-4 py-3">
      <div className="text-[11px] uppercase tracking-wide text-[#8a8677] font-medium">{label}</div>
      <div className="text-xl font-semibold text-[#1c2128] mt-0.5">{value}</div>
      {sub && <div className="text-[11px] text-[#a39d8a] mt-0.5">{sub}</div>}
    </div>
  );
}
