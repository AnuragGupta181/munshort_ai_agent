import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  GitCompareArrows,
  Package,
  Lightbulb,
  Luggage,
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Overview' },
  { to: '/brands', icon: GitCompareArrows, label: 'Brand Comparison' },
  { to: '/products', icon: Package, label: 'Products' },
  { to: '/insights', icon: Lightbulb, label: 'Insights' },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-white border-r border-slate-200 flex flex-col z-20">
      <div className="p-5 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Luggage className="w-7 h-7 text-blue-600" />
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-tight">LugInsight</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Brand Intelligence</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <item.icon className="w-4.5 h-4.5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-200">
        <p className="text-xs text-slate-400">Amazon India Analysis</p>
        <p className="text-xs text-slate-400">Luggage Category</p>
      </div>
    </aside>
  );
}
