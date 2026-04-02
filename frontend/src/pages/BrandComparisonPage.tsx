import { useState } from 'react';
import { useBrands, useAspects } from '../hooks/useApi';
import BrandScatterPlot from '../components/charts/BrandScatterPlot';
import AspectHeatmap from '../components/charts/AspectHeatmap';
import SentimentRadar from '../components/charts/SentimentRadar';
import DiscountBarChart from '../components/charts/DiscountBarChart';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Badge from '../components/common/Badge';
import { ArrowUpDown, Star, ThumbsUp, ThumbsDown } from 'lucide-react';

type SortField = 'avg_price' | 'avg_discount' | 'avg_rating' | 'review_count' | 'sentiment_score';

export default function BrandComparisonPage() {
  const [sortField, setSortField] = useState<SortField>('sentiment_score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { data: brands, isLoading } = useBrands(sortField, sortOrder);
  const { data: aspects } = useAspects();

  if (isLoading || !brands) return <LoadingSpinner />;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const SortHeader = ({ field, label }: { field: SortField; label: string }) => (
    <th
      className="py-3 px-4 text-left text-xs font-medium text-slate-500 cursor-pointer hover:text-slate-900 select-none"
      onClick={() => handleSort(field)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <ArrowUpDown className={`w-3 h-3 ${sortField === field ? 'text-blue-600' : 'text-slate-300'}`} />
      </span>
    </th>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Brand Comparison</h1>
        <p className="text-sm text-slate-500 mt-1">
          Side-by-side analysis of {brands.length} luggage brands
        </p>
      </div>

      {/* Comparison table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-slate-500">Brand</th>
                <SortHeader field="avg_price" label="Avg Price" />
                <SortHeader field="avg_discount" label="Discount %" />
                <SortHeader field="avg_rating" label="Rating" />
                <SortHeader field="review_count" label="Reviews" />
                <SortHeader field="sentiment_score" label="Sentiment" />
                <th className="py-3 px-4 text-left text-xs font-medium text-slate-500">Top Pro</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-slate-500">Top Con</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {brands.map((brand) => (
                <tr key={brand.slug} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">{brand.name}</span>
                      <Badge
                        label={brand.price_band}
                        variant={
                          brand.price_band === 'premium' ? 'info' :
                          brand.price_band === 'midrange' ? 'neutral' : 'warning'
                        }
                      />
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">
                    ₹{Math.round(brand.avg_price).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`font-medium ${brand.avg_discount > 40 ? 'text-rose-600' : 'text-slate-700'}`}>
                      {brand.avg_discount.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 font-medium text-slate-800">
                      {brand.avg_rating.toFixed(1)}
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700">{brand.review_count}</td>
                  <td className="py-3 px-4">
                    <span className={`font-bold ${
                      brand.sentiment_score > 0.5 ? 'text-emerald-600' :
                      brand.sentiment_score > 0.2 ? 'text-blue-600' :
                      brand.sentiment_score > 0 ? 'text-amber-600' : 'text-rose-600'
                    }`}>
                      {brand.sentiment_score.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      <ThumbsUp className="w-3 h-3" />
                      {brand.top_pros[0]}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-xs text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                      <ThumbsDown className="w-3 h-3" />
                      {brand.top_cons[0]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <BrandScatterPlot brands={brands} />
        {aspects && <AspectHeatmap data={aspects} />}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {aspects && <SentimentRadar data={aspects} />}
        <DiscountBarChart brands={brands} />
      </div>
    </div>
  );
}
