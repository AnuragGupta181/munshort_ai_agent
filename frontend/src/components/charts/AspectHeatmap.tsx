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

function getColor(value: number): string {
  if (value > 0.5) return '#22c55e';
  if (value > 0.3) return '#86efac';
  if (value > 0.1) return '#bbf7d0';
  if (value > -0.1) return '#fef9c3';
  if (value > -0.3) return '#fecaca';
  return '#f87171';
}

function getTextColor(value: number): string {
  if (value > 0.5 || value < -0.3) return '#fff';
  return '#1e293b';
}

interface Props {
  data: AspectData[];
}

export default function AspectHeatmap({ data }: Props) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">Aspect-Level Sentiment Heatmap</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="text-left py-2 px-3 font-medium text-slate-500">Brand</th>
              {ASPECTS.map((a) => (
                <th key={a} className="py-2 px-3 font-medium text-slate-500 text-center">
                  {ASPECT_LABELS[a]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.brand}>
                <td className="py-1.5 px-3 font-medium text-slate-800">{row.brand}</td>
                {ASPECTS.map((a) => {
                  const val = row[a as keyof AspectData] as number;
                  return (
                    <td key={a} className="py-1.5 px-3 text-center">
                      <span
                        className="inline-block w-14 py-1 rounded-md text-xs font-semibold"
                        style={{ backgroundColor: getColor(val), color: getTextColor(val) }}
                      >
                        {val.toFixed(2)}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-1 mt-4 justify-center text-[10px] text-slate-500">
        <span>Negative</span>
        {['#f87171', '#fecaca', '#fef9c3', '#bbf7d0', '#86efac', '#22c55e'].map((c) => (
          <div key={c} className="w-6 h-3 rounded-sm" style={{ backgroundColor: c }} />
        ))}
        <span>Positive</span>
      </div>
    </div>
  );
}
