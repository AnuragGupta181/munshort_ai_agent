import { useFilterStore } from '../../stores/filterStore';
import { useFilters } from '../../hooks/useApi';
import { RotateCcw } from 'lucide-react';

export default function FilterBar() {
  const {
    selectedBrands,
    setSelectedBrands,
    minRating,
    setMinRating,
    category,
    setCategory,
    resetFilters,
  } = useFilterStore();
  const { data: filterOptions } = useFilters();

  if (!filterOptions) return null;

  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  const hasActive = selectedBrands.length > 0 || minRating > 0 || category !== '';

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 mb-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-700">Filters</h3>
        {hasActive && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-4">
        {/* Brand selector */}
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1.5">Brand</p>
          <div className="flex flex-wrap gap-1.5">
            {filterOptions.brands.map((brand) => (
              <button
                key={brand}
                onClick={() => toggleBrand(brand)}
                className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                  selectedBrands.includes(brand)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {/* Rating filter */}
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1.5">Min Rating</p>
          <select
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700"
          >
            <option value={0}>All</option>
            <option value={3}>3+ Stars</option>
            <option value={3.5}>3.5+ Stars</option>
            <option value={4}>4+ Stars</option>
            <option value={4.5}>4.5+ Stars</option>
          </select>
        </div>

        {/* Category filter */}
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1.5">Category</p>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700"
          >
            <option value="">All</option>
            {filterOptions.categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
