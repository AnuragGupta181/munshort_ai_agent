import { create } from 'zustand';

interface FilterState {
  selectedBrands: string[];
  priceRange: [number, number];
  minRating: number;
  sentimentRange: [number, number];
  category: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  setSelectedBrands: (brands: string[]) => void;
  setPriceRange: (range: [number, number]) => void;
  setMinRating: (rating: number) => void;
  setSentimentRange: (range: [number, number]) => void;
  setCategory: (category: string) => void;
  setSortBy: (field: string) => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  resetFilters: () => void;
}

const INITIAL_STATE = {
  selectedBrands: [] as string[],
  priceRange: [0, 15000] as [number, number],
  minRating: 0,
  sentimentRange: [-1, 1] as [number, number],
  category: '',
  sortBy: 'sentiment_score',
  sortOrder: 'desc' as const,
};

export const useFilterStore = create<FilterState>((set) => ({
  ...INITIAL_STATE,
  setSelectedBrands: (brands) => set({ selectedBrands: brands }),
  setPriceRange: (range) => set({ priceRange: range }),
  setMinRating: (rating) => set({ minRating: rating }),
  setSentimentRange: (range) => set({ sentimentRange: range }),
  setCategory: (category) => set({ category }),
  setSortBy: (field) => set({ sortBy: field }),
  setSortOrder: (order) => set({ sortOrder: order }),
  resetFilters: () => set(INITIAL_STATE),
}));
