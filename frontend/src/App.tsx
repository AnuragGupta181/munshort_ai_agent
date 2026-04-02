import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PageLayout from './components/layout/PageLayout';
import OverviewPage from './pages/OverviewPage';
import BrandComparisonPage from './pages/BrandComparisonPage';
import ProductDrilldownPage from './pages/ProductDrilldownPage';
import InsightsPage from './pages/InsightsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<PageLayout />}>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/brands" element={<BrandComparisonPage />} />
            <Route path="/products" element={<ProductDrilldownPage />} />
            <Route path="/insights" element={<InsightsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
