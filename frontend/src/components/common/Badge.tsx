interface BadgeProps {
  label: string;
  variant: 'positive' | 'negative' | 'neutral' | 'info' | 'warning' | 'critical';
}

const variants: Record<string, string> = {
  positive: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  negative: 'bg-rose-50 text-rose-700 border-rose-200',
  neutral: 'bg-slate-50 text-slate-600 border-slate-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  critical: 'bg-red-50 text-red-700 border-red-200',
};

export default function Badge({ label, variant }: BadgeProps) {
  return (
    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full border ${variants[variant]}`}>
      {label}
    </span>
  );
}
