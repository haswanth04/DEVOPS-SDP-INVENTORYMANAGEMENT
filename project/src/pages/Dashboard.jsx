import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../utils/api';
import {
  UsersIcon,
  CubeIcon,
  TruckIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ChartPieIcon,
  ArrowPathIcon,
  BellAlertIcon,
  CheckBadgeIcon,
  BoltIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockCount: 0,
    totalSuppliers: 0,
    totalUsers: 0
  });
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
    fetchLowStockProducts();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await apiService.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchLowStockProducts = async () => {
    try {
      const response = await apiService.getProducts();
      const lowStock = response.data.filter(product => product.stock <= product.lowStockThreshold);
      setLowStockProducts(lowStock);
    } catch (error) {
      console.error('Failed to fetch low stock products:', error);
      setLowStockProducts([]);
    }
  };

  const normalizedRole = user?.role?.toUpperCase() || 'GUEST';

  const personaCopy = {
    ADMIN: {
      headline: 'System Overview',
      subtext: 'Manage users and system settings.',
      badge: 'Admin'
    },
    MANAGER: {
      headline: 'Operations Dashboard',
      subtext: 'Overview of inventory and suppliers.',
      badge: 'Manager'
    },
    STAFF: {
      headline: 'My Workspace',
      subtext: 'Manage your assigned tasks and stock.',
      badge: 'Staff'
    },
    GUEST: {
      headline: 'Welcome',
      subtext: 'Please log in to access the system.',
      badge: 'Guest'
    }
  }[normalizedRole] || personaCopy.GUEST;

  const highlightMetrics = [
    {
      label: 'Total products',
      value: stats.totalProducts,
      trend: '+12%',
      tone: 'positive',
      icon: CubeIcon,
      footnote: 'catalog breadth'
    },
    {
      label: 'Low stock alerts',
      value: stats.lowStockCount,
      trend: `${stats.lowStockCount > 5 ? '+6' : '-4'}`,
      tone: stats.lowStockCount > 0 ? 'warning' : 'positive',
      icon: ExclamationTriangleIcon,
      footnote: 'needs review'
    },
    {
      label: 'Total suppliers',
      value: stats.totalSuppliers,
      trend: '+3 onboarded',
      tone: 'neutral',
      icon: TruckIcon,
      footnote: 'active partners'
    },
    {
      label: 'Licensed users',
      value: stats.totalUsers,
      trend: '+2 invites',
      tone: 'neutral',
      icon: UsersIcon,
      footnote: 'workspace members',
      hide: normalizedRole !== 'ADMIN'
    }
  ].filter((metric) => !metric.hide);



  const quickActions = [
    {
      label: 'Raise purchase order',
      action: () => navigate('/inventory'),
      icon: ArrowTrendingUpIcon
    },
    {
      label: 'Alert supplier',
      action: () => navigate('/suppliers'),
      icon: BellAlertIcon
    },
    {
      label: 'Review tasks',
      action: () => navigate('/task-management'),
      icon: CheckBadgeIcon
    },
    {
      label: 'Sync team access',
      action: () => navigate('/users'),
      icon: UsersIcon,
      restricted: normalizedRole !== 'ADMIN'
    }
  ].filter(action => !action.restricted);

  const personaActions = {
    ADMIN: ['users', 'reports', 'settings'],
    MANAGER: ['inventory', 'suppliers', 'task-management'],
    STAFF: ['stock', 'tasks']
  }[normalizedRole] || [];

  const pillActions = personaActions.map((route) => ({
    label: route.replace('-', ' '),
    action: () => navigate(`/${route}`)
  }));

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        </div>
        <div className="flex gap-3">
          {pillActions.map((pill) => (
            <button
              key={pill.label}
              onClick={pill.action}
              className="px-4 py-2 rounded-lg text-sm bg-white/10 text-white hover:bg-white/20 transition"
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      <section className="metric-grid">
        {highlightMetrics.map((metric) => (
          <div key={metric.label} className="metric-card">
            <div className="flex items-center justify-between">
              <p className="metric-card__label">{metric.label}</p>
              <metric.icon className="w-5 h-5 text-white/60" />
            </div>
            <p className="metric-card__value">{metric.value}</p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 page-section">
          <div className="section-title">
            <ExclamationTriangleIcon className="w-5 h-5 text-amber-300" />
            Low Stock Alerts
          </div>
          <div className="space-y-4">
            {lowStockProducts.length === 0 ? (
              <div className="glass-panel p-8 text-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center mx-auto mb-3">
                  <ArrowPathIcon className="w-6 h-6" />
                </div>
                <p className="text-white font-semibold">All products are comfortably stocked.</p>
              </div>
            ) : (
              lowStockProducts.slice(0, 6).map((product) => (
                <div key={product.id} className="glass-panel p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/20 flex items-center justify-center text-rose-300 font-semibold">
                    {product.category?.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-xs text-white/60">Stock: {product.stock} • Min: {product.lowStockThreshold}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="text-white/80">${product.price}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="page-section space-y-5">
          <div className="section-title">
            <BoltIcon className="w-5 h-5 text-primary-300" />
            Quick Actions
          </div>
          <div className="space-y-3">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={action.action}
                className="w-full glass-panel p-4 flex items-center justify-between hover:bg-white/10 transition"
              >
                <span className="text-sm font-semibold">{action.label}</span>
                <action.icon className="w-5 h-5 text-white/70" />
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;