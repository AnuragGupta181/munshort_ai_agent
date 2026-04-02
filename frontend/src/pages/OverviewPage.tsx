import { useOverview, useInsights } from '../hooks/useApi';
import StatCard from '../components/cards/StatCard';
import PriceDistributionChart from '../components/charts/PriceDistributionChart';
import SentimentBarChart from '../components/charts/SentimentBarChart';
import DiscountBarChart from '../components/charts/DiscountBarChart';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Badge from '../components/common/Badge';
import { Link } from 'react-router-dom';
import {
  Building2,
  Package,
  MessageSquare,
  TrendingUp,
  Star,
  Lightbulb,
} from 'lucide-react';

export default function OverviewPage() {
  const { data, isLoading } = useOverview();
  const { data: insights } = useInsights();

  if (isLoading || !data) return <LoadingSpinner />;

  const sentimentColor = data.avg_sentiment > 0.4 ? 'green' : data.avg_sentiment > 0 ? 'amber' : 'rose';

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-sm text-slate-500 mt-1">
          Competitive intelligence across {data.total_brands} luggage brands on Amazon India
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Brands Tracked"
          value={data.total_brands}
          icon={<Building2 className="w-5 h-5" />}
          color="blue"
        />
        <StatCard
          label="Products Analyzed"
          value={data.total_products}
          icon={<Package className="w-5 h-5" />}
          color="purple"
        />
        <StatCard
          label="Reviews Analyzed"
          value={data.total_reviews}
          icon={<MessageSquare className="w-5 h-5" />}
          color="amber"
        />
        <StatCard
          label="Avg Sentiment"
          value={data.avg_sentiment.toFixed(2)}
          icon={<TrendingUp className="w-5 h-5" />}
          subtitle={`₹${Math.round(data.avg_price).toLocaleString()} avg price`}
          color={sentimentColor}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <PriceDistributionChart brands={data.brand_summaries} />
        <SentimentBarChart brands={data.brand_summaries} />
      </div>

      <div className="mb-6">
        <DiscountBarChart brands={data.brand_summaries} />
      </div>

      {/* Brand cards */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Brand Snapshot</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.brand_summaries.map((brand) => (
            <Link
              key={brand.slug}
              to={`/brands?highlight=${brand.slug}`}
              className="block bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-900">{brand.name}</h3>
                <Badge
                  label={brand.price_band}
                  variant={
                    brand.price_band === 'premium'
                      ? 'info'
                      : brand.price_band === 'midrange'
                      ? 'neutral'
                      : 'warning'
                  }
                />
              </div>
              <div className="grid grid-cols-3 gap-3 mb-3 text-center">
                <div>
                  <p className="text-lg font-bold text-slate-900">₹{Math.round(brand.avg_price).toLocaleString()}</p>
                  <p className="text-[10px] text-slate-400">Avg Price</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900 flex items-center justify-center gap-0.5">
                    {brand.avg_rating.toFixed(1)} <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  </p>
                  <p className="text-[10px] text-slate-400">Rating</p>
                </div>
                <div>
                  <p className={`text-lg font-bold ${brand.sentiment_score > 0.5 ? 'text-emerald-600' : brand.sentiment_score > 0.2 ? 'text-blue-600' : 'text-amber-600'}`}>
                    {brand.sentiment_score.toFixed(2)}
                  </p>
                  <p className="text-[10px] text-slate-400">Sentiment</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {brand.top_pros.slice(0, 2).map((pro) => (
                  <span key={pro} className="text-[10px] px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded">
                    + {pro}
                  </span>
                ))}
                {brand.top_cons.slice(0, 1).map((con) => (
                  <span key={con} className="text-[10px] px-1.5 py-0.5 bg-rose-50 text-rose-700 rounded">
                    - {con}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Top insights preview */}
      {insights && insights.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" /> Agent Insights
            </h2>
            <Link to="/insights" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {insights.slice(0, 2).map((insight, i) => (
              <div key={i} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-5">
                <p className="text-xs font-medium text-blue-600 uppercase tracking-wider mb-1">
                  {insight.insight_type.replace('_', ' ')}
                </p>
                <h3 className="text-sm font-semibold text-slate-900 mb-2">{insight.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{insight.description}</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {insight.affected_brands.map((b) => (
                    <Badge key={b} label={b} variant="info" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
