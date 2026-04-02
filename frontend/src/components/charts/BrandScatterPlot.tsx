import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
  Cell,
} from 'recharts';
import type { BrandSummary } from '../../types';

const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444', '#22c55e'];

interface Props {
  brands: BrandSummary[];
}

export default function BrandScatterPlot({ brands }: Props) {
  const data = brands.map((b) => ({
    name: b.name,
    x: Math.round(b.avg_price),
    y: Number(b.sentiment_score.toFixed(2)),
    z: b.review_count,
  }));

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: typeof data[0] }> }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-lg text-xs">
        <p className="font-semibold text-slate-900">{d.name}</p>
        <p className="text-slate-600">Price: ₹{d.x.toLocaleString()}</p>
        <p className="text-slate-600">Sentiment: {d.y}</p>
        <p className="text-slate-600">Reviews: {d.z}</p>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h3 className="text-sm font-semibold text-slate-900 mb-1">Price vs Sentiment</h3>
      <p className="text-xs text-slate-400 mb-4">Bubble size = review count</p>
      <ResponsiveContainer width="100%" height={320}>
        <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            type="number"
            dataKey="x"
            name="Price"
            tick={{ fontSize: 11, fill: '#64748b' }}
            tickFormatter={(v) => `₹${v.toLocaleString()}`}
            label={{ value: 'Avg Price (₹)', position: 'bottom', offset: -5, fontSize: 11, fill: '#94a3b8' }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Sentiment"
            domain={[-0.5, 1]}
            tick={{ fontSize: 11, fill: '#64748b' }}
            label={{ value: 'Sentiment', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#94a3b8' }}
          />
          <ZAxis type="number" dataKey="z" range={[200, 800]} />
          <Tooltip content={<CustomTooltip />} />
          <Scatter data={data}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.8} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-3 mt-3 justify-center">
        {data.map((d, i) => (
          <div key={d.name} className="flex items-center gap-1.5 text-xs text-slate-600">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
            {d.name}
          </div>
        ))}
      </div>
    </div>
  );
}
