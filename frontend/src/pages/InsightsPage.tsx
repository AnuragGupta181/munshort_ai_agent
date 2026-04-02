import { useInsights, useAnomalies, useValueForMoney, useTrustSignals } from '../hooks/useApi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Badge from '../components/common/Badge';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  Lightbulb,
  AlertTriangle,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  Info,
} from 'lucide-react';

const INSIGHT_ICONS: Record<string, typeof Lightbulb> = {
  competitive_advantage: TrendingUp,
  pricing_strategy: AlertCircle,
  product_gap: AlertTriangle,
  value_analysis: ShieldCheck,
  customer_driver: Lightbulb,
};

const VFM_COLORS: Record<string, string> = {
  budget: '#f59e0b',
  value: '#06b6d4',
  midrange: '#8b5cf6',
  premium: '#3b82f6',
};

export default function InsightsPage() {
  const { data: insights, isLoading: loadingInsights } = useInsights();
  const { data: anomalies } = useAnomalies();
  const { data: vfm } = useValueForMoney();
  const { data: trust } = useTrustSignals();

  if (loadingInsights) return <LoadingSpinner />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Agent Insights</h1>
        <p className="text-sm text-slate-500 mt-1">
          AI-generated conclusions and anomaly detection
        </p>
      </div>

      {/* Insights */}
      {insights && insights.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            Non-Obvious Conclusions
          </h2>
          <div className="space-y-4">
            {insights.map((insight, i) => {
              const Icon = INSIGHT_ICONS[insight.insight_type] || Lightbulb;
              return (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-200 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          label={insight.insight_type.replace(/_/g, ' ')}
                          variant="info"
                        />
                        <div className="flex gap-1">
                          {insight.affected_brands.filter(Boolean).map((b) => (
                            <Badge key={b} label={b} variant="neutral" />
                          ))}
                        </div>
                      </div>
                      <h3 className="text-sm font-semibold text-slate-900 mb-2">{insight.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed mb-3">{insight.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {insight.supporting_data.map((d, j) => (
                          <span key={j} className="text-[10px] px-2 py-1 bg-slate-50 text-slate-600 rounded-md border border-slate-100">
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Value for money */}
        {vfm && vfm.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-1">Value for Money Analysis</h3>
            <p className="text-xs text-slate-400 mb-4">Sentiment adjusted by price band</p>
            <ResponsiveContainer width="100%" height={280}>
              <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  type="number"
                  dataKey="avg_price"
                  name="Price"
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  tickFormatter={(v) => `₹${v.toLocaleString()}`}
                  label={{ value: 'Average Price', position: 'bottom', offset: 0, fontSize: 10, fill: '#94a3b8' }}
                />
                <YAxis
                  type="number"
                  dataKey="sentiment_score"
                  name="Sentiment"
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  label={{ value: 'Sentiment', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#94a3b8' }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-lg text-xs">
                        <p className="font-semibold">{d.brand}</p>
                        <p>Price: ₹{d.avg_price.toLocaleString()}</p>
                        <p>Sentiment: {d.sentiment_score.toFixed(2)}</p>
                        <p>Value Score: {d.value_score.toFixed(1)}</p>
                        <Badge label={d.price_band} variant="info" />
                      </div>
                    );
                  }}
                />
                <Scatter data={vfm}>
                  {vfm.map((entry, i) => (
                    <Cell key={i} fill={VFM_COLORS[entry.price_band] || '#94a3b8'} r={8} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 mt-2 justify-center">
              {Object.entries(VFM_COLORS).map(([band, color]) => (
                <div key={band} className="flex items-center gap-1.5 text-xs text-slate-600">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                  <span className="capitalize">{band}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trust signals */}
        {trust && trust.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-1">Review Trust Leaderboard</h3>
            <p className="text-xs text-slate-400 mb-4">Products ranked by review authenticity</p>
            <div className="space-y-2 max-h-[340px] overflow-y-auto">
              {[...trust]
                .sort((a, b) => b.trust_score - a.trust_score)
                .slice(0, 12)
                .map((signal) => (
                  <div key={signal.asin} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${
                      signal.trust_score > 80 ? 'bg-emerald-50 text-emerald-700' :
                      signal.trust_score > 60 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {Math.round(signal.trust_score)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-900 truncate">{signal.product_title}</p>
                      <p className="text-[10px] text-slate-400">
                        {signal.brand} | {signal.total_reviews} reviews | {signal.verified_ratio}% verified
                      </p>
                    </div>
                    {signal.flags.length > 0 && (
                      <div className="shrink-0">
                        <Info className="w-3.5 h-3.5 text-amber-500" />
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Anomalies */}
      {anomalies && anomalies.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Detected Anomalies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {anomalies.map((anomaly, i) => (
              <div
                key={i}
                className={`rounded-xl border p-4 ${
                  anomaly.severity === 'critical'
                    ? 'border-red-200 bg-red-50'
                    : anomaly.severity === 'warning'
                    ? 'border-amber-200 bg-amber-50'
                    : 'border-blue-200 bg-blue-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Badge label={anomaly.severity} variant={
                    anomaly.severity === 'critical' ? 'critical' :
                    anomaly.severity === 'warning' ? 'warning' : 'info'
                  } />
                  <Badge label={anomaly.type.replace(/_/g, ' ')} variant="neutral" />
                </div>
                <p className="text-xs font-medium text-slate-900 mb-1">{anomaly.brand}</p>
                <p className="text-[11px] text-slate-600 leading-relaxed">{anomaly.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
