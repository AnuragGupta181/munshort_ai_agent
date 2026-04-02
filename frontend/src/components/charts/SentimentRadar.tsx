import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import type { AspectData } from '../../types';

const ASPECT_LABELS: Record<string, string> = {
  wheels: 'Wheels',
  handle: 'Handle',
  material: 'Material',
  zipper: 'Zipper',
  size_space: 'Size/Space',
  durability: 'Durability',
};

const ASPECTS = ['wheels', 'handle', 'material', 'zipper', 'size_space', 'durability'];
const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444', '#22c55e'];

interface Props {
  data: AspectData[];
  selectedBrands?: string[];
}

export default function SentimentRadar({ data, selectedBrands }: Props) {
  const filtered = selectedBrands?.length
    ? data.filter((d) => selectedBrands.includes(d.brand))
    : data;

  const chartData = ASPECTS.map((aspect) => {
    const entry: Record<string, string | number> = { aspect: ASPECT_LABELS[aspect] };
    filtered.forEach((brand) => {
      entry[brand.brand] = Number((brand[aspect as keyof AspectData] as number).toFixed(2));
    });
    return entry;
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">Aspect Sentiment Radar</h3>
      <ResponsiveContainer width="100%" height={350}>
        <RadarChart data={chartData}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="aspect" tick={{ fontSize: 11, fill: '#64748b' }} />
          <PolarRadiusAxis tick={{ fontSize: 9, fill: '#94a3b8' }} domain={[-0.5, 1]} />
          <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {filtered.map((brand, i) => (
            <Radar
              key={brand.brand}
              name={brand.brand}
              dataKey={brand.brand}
              stroke={COLORS[i % COLORS.length]}
              fill={COLORS[i % COLORS.length]}
              fillOpacity={0.1}
              strokeWidth={2}
            />
          ))}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
