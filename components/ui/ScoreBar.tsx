interface Props {
  label: string;
  score: number; // 1–10
}

export default function ScoreBar({ label, score }: Props) {
  const pct = (score / 10) * 100;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-teal/70 font-medium w-24 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-teal/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-teal transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-bold text-teal tabular-nums w-6 text-right">{score}</span>
    </div>
  );
}
