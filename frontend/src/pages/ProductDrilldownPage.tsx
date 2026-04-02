import { useState } from 'react';
import { useProducts } from '../hooks/useApi';
import { useFilterStore } from '../stores/filterStore';
import FilterBar from '../components/filters/FilterBar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Badge from '../components/common/Badge';
import {
  Star,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  ThumbsUp,
  ThumbsDown,
  ArrowUpDown,
} from 'lucide-react';
import type { Product } from '../types';

export default function ProductDrilldownPage() {
  const { selectedBrands, minRating, category } = useFilterStore();
  const [expandedAsin, setExpandedAsin] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('sentiment_score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const params: Record<string, unknown> = {
    sort_by: sortBy,
    order: sortOrder,
    limit: 100,
  };
  if (selectedBrands.length === 1) params.brand = selectedBrands[0];
  if (minRating > 0) params.min_rating = minRating;
  if (category) params.category = category;

  const { data, isLoading } = useProducts(params);

  if (isLoading || !data) return <LoadingSpinner />;

  let products = data.products;
  if (selectedBrands.length > 1) {
    products = products.filter((p) => selectedBrands.includes(p.brand));
  }

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const SortTh = ({ field, label, className = '' }: { field: string; label: string; className?: string }) => (
    <th
      className={`py-3 px-3 text-xs font-medium text-slate-500 cursor-pointer hover:text-slate-900 select-none ${className}`}
      onClick={() => handleSort(field)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <ArrowUpDown className={`w-3 h-3 ${sortBy === field ? 'text-blue-600' : 'text-slate-300'}`} />
      </span>
    </th>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Product Drilldown</h1>
        <p className="text-sm text-slate-500 mt-1">
          Explore {products.length} products with reviews and sentiment
        </p>
      </div>

      <FilterBar />

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="py-3 px-3 text-left text-xs font-medium text-slate-500 w-8"></th>
                <th className="py-3 px-3 text-left text-xs font-medium text-slate-500">Product</th>
                <th className="py-3 px-3 text-left text-xs font-medium text-slate-500">Brand</th>
                <SortTh field="price" label="Price" />
                <SortTh field="discount_pct" label="Discount" />
                <SortTh field="rating" label="Rating" />
                <SortTh field="review_count" label="Reviews" />
                <SortTh field="sentiment_score" label="Sentiment" />
                <SortTh field="trust_score" label="Trust" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <ProductRow
                  key={product.asin}
                  product={product}
                  isExpanded={expandedAsin === product.asin}
                  onToggle={() => setExpandedAsin(expandedAsin === product.asin ? null : product.asin)}
                />
              ))}
            </tbody>
          </table>
        </div>
        {products.length === 0 && (
          <div className="py-16 text-center text-slate-400 text-sm">
            No products match your filters.
          </div>
        )}
      </div>
    </div>
  );
}

function ProductRow({
  product,
  isExpanded,
  onToggle,
}: {
  product: Product;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <tr className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={onToggle}>
        <td className="py-2.5 px-3 text-slate-400">
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </td>
        <td className="py-2.5 px-3">
          <p className="text-xs font-medium text-slate-900 max-w-xs truncate">{product.title}</p>
        </td>
        <td className="py-2.5 px-3 text-xs text-slate-700">{product.brand}</td>
        <td className="py-2.5 px-3">
          <div>
            <span className="font-semibold text-slate-900 text-xs">₹{product.price.toLocaleString()}</span>
            <span className="text-[10px] text-slate-400 line-through ml-1">₹{product.list_price.toLocaleString()}</span>
          </div>
        </td>
        <td className="py-2.5 px-3">
          <span className={`text-xs font-medium ${product.discount_pct > 40 ? 'text-rose-600' : 'text-emerald-600'}`}>
            {product.discount_pct.toFixed(0)}%
          </span>
        </td>
        <td className="py-2.5 px-3">
          <span className="inline-flex items-center gap-0.5 text-xs font-medium text-slate-800">
            {product.rating.toFixed(1)} <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          </span>
        </td>
        <td className="py-2.5 px-3 text-xs text-slate-600">{product.review_count}</td>
        <td className="py-2.5 px-3">
          <span className={`text-xs font-bold ${
            product.sentiment_score > 0.5 ? 'text-emerald-600' :
            product.sentiment_score > 0.2 ? 'text-blue-600' :
            product.sentiment_score > 0 ? 'text-amber-600' : 'text-rose-600'
          }`}>
            {product.sentiment_score.toFixed(2)}
          </span>
        </td>
        <td className="py-2.5 px-3">
          <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${
            product.trust_score > 75 ? 'text-emerald-600' : product.trust_score > 50 ? 'text-amber-600' : 'text-rose-600'
          }`}>
            <ShieldCheck className="w-3 h-3" /> {product.trust_score.toFixed(0)}
          </span>
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={9} className="bg-slate-50 px-6 py-5">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Synthesis */}
              <div className="lg:col-span-2">
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Review Synthesis
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">{product.review_synthesis}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-xs font-semibold text-emerald-700 flex items-center gap-1 mb-1.5">
                      <ThumbsUp className="w-3 h-3" /> What Customers Love
                    </h5>
                    <div className="flex flex-wrap gap-1">
                      {product.appreciation_themes.map((theme) => (
                        <Badge key={theme} label={theme} variant="positive" />
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-rose-700 flex items-center gap-1 mb-1.5">
                      <ThumbsDown className="w-3 h-3" /> Common Complaints
                    </h5>
                    <div className="flex flex-wrap gap-1">
                      {product.complaint_themes.map((theme) => (
                        <Badge key={theme} label={theme} variant="negative" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Aspects */}
              <div>
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Aspect Scores
                </h4>
                <div className="space-y-2">
                  {Object.entries(product.aspects).map(([aspect, score]) => {
                    const pct = ((score + 1) / 2) * 100;
                    return (
                      <div key={aspect}>
                        <div className="flex justify-between text-xs mb-0.5">
                          <span className="text-slate-600 capitalize">{aspect.replace('_', ' ')}</span>
                          <span className={`font-medium ${score > 0.3 ? 'text-emerald-600' : score > 0 ? 'text-blue-600' : 'text-rose-600'}`}>
                            {score.toFixed(2)}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${score > 0.3 ? 'bg-emerald-500' : score > 0 ? 'bg-blue-500' : 'bg-rose-500'}`}
                            style={{ width: `${Math.max(5, pct)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
