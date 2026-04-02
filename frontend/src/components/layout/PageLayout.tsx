import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function PageLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 ml-60 p-6">
        <Outlet />
      </main>
    </div>
  );
}
