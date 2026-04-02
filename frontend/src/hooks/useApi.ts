import { useQuery } from '@tanstack/react-query';
import api from '../api/client';
import type {
  OverviewData,
  BrandSummary,
  ProductsResponse,
  Product,
  Review,
  InsightItem,
  AnomalyItem,
  AspectData,
  ValueForMoney,
  TrustSignal,
  FilterOptions,
} from '../types';

export function useOverview() {
  return useQuery<OverviewData>({
    queryKey: ['overview'],
    queryFn: () => api.get('/overview').then((r) => r.data),
  });
}

export function useBrands(sortBy = 'sentiment_score', order = 'desc') {
  return useQuery<BrandSummary[]>({
    queryKey: ['brands', sortBy, order],
    queryFn: () =>
      api.get('/brands', { params: { sort_by: sortBy, order } }).then((r) => r.data),
  });
}

export function useBrand(slug: string) {
  return useQuery({
    queryKey: ['brand', slug],
    queryFn: () => api.get(`/brands/${slug}`).then((r) => r.data),
    enabled: !!slug,
  });
}

export function useProducts(params: Record<string, unknown> = {}) {
  return useQuery<ProductsResponse>({
    queryKey: ['products', params],
    queryFn: () => api.get('/products', { params }).then((r) => r.data),
  });
}

export function useProduct(asin: string) {
  return useQuery<Product & { reviews: Review[] }>({
    queryKey: ['product', asin],
    queryFn: () => api.get(`/products/${asin}`).then((r) => r.data),
    enabled: !!asin,
  });
}

export function useInsights() {
  return useQuery<InsightItem[]>({
    queryKey: ['insights'],
    queryFn: () => api.get('/insights').then((r) => r.data),
  });
}

export function useAnomalies() {
  return useQuery<AnomalyItem[]>({
    queryKey: ['anomalies'],
    queryFn: () => api.get('/anomalies').then((r) => r.data),
  });
}

export function useAspects() {
  return useQuery<AspectData[]>({
    queryKey: ['aspects'],
    queryFn: () => api.get('/aspects').then((r) => r.data),
  });
}

export function useValueForMoney() {
  return useQuery<ValueForMoney[]>({
    queryKey: ['value-for-money'],
    queryFn: () => api.get('/value-for-money').then((r) => r.data),
  });
}

export function useTrustSignals() {
  return useQuery<TrustSignal[]>({
    queryKey: ['trust-signals'],
    queryFn: () => api.get('/trust-signals').then((r) => r.data),
  });
}

export function useFilters() {
  return useQuery<FilterOptions>({
    queryKey: ['filters'],
    queryFn: () => api.get('/filters').then((r) => r.data),
  });
}
