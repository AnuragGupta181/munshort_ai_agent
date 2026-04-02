import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';
import type { BrandSummary } from '../../types';

const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444', '#22c55e'];

interface Props {
  brands: BrandSummary[];
}

export default function DiscountBarChart({ brands }: Props) {
  const data = [...brands]
    .sort((a, b) => b.avg_discount - a.avg_discount)
    .map((b) => ({
      name: b.name,
      discount: Number(b.avg_discount.toFixed(1)),
    }));

  const avg = data.reduce((s, d) => s + d.discount, 0) / data.length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">Average Discount % by Brand</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(v) => `${v}%`} />
          <Tooltip
            formatter={(value) => [`${value}%`, 'Discount']}
            contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
          />
          <ReferenceLine y={avg} stroke="#94a3b8" strokeDasharray="4 4" label={{ value: `Avg ${avg.toFixed(0)}%`, position: 'right', fontSize: 10, fill: '#94a3b8' }} />
          <Bar dataKey="discount" radius={[6, 6, 0, 0]} maxBarSize={50}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
