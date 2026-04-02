import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { BrandSummary } from '../../types';

interface Props {
  brands: BrandSummary[];
}

export default function SentimentBarChart({ brands }: Props) {
  const data = [...brands]
    .sort((a, b) => b.sentiment_score - a.sentiment_score)
    .map((b) => ({
      name: b.name,
      sentiment: Number(b.sentiment_score.toFixed(2)),
    }));

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">Sentiment Score by Brand</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 70 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
          <XAxis type="number" domain={[-1, 1]} tick={{ fontSize: 11, fill: '#64748b' }} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} width={65} />
          <Tooltip
            formatter={(value) => [Number(value).toFixed(2), 'Sentiment']}
            contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
          />
          <Bar dataKey="sentiment" radius={[0, 6, 6, 0]} maxBarSize={28}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.sentiment > 0.5 ? '#22c55e' : entry.sentiment > 0.2 ? '#3b82f6' : entry.sentiment > 0 ? '#f59e0b' : '#ef4444'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
