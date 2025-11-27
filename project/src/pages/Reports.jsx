import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/UI/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { apiService } from '../utils/api';
import {
  ChartBarIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';

const Reports = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { hasRole } = useAuth();

  useEffect(() => {
    if (!hasRole('ADMIN')) {
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await apiService.getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!hasRole('Admin')) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
          <p className="mt-2 text-gray-600">You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner text="Loading reports..." />;
  }

  const lowStockProducts = products.filter(p => p.stock <= p.lowStockThreshold);
  const totalValue = products.reduce((sum, product) => sum + (product.stock * product.price), 0);
  const avgStockLevel = products.reduce((sum, product) => sum + product.stock, 0) / products.length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="mt-2 text-gray-600">Comprehensive inventory insights and analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card
          title="Inventory Value"
          value={`$${totalValue.toLocaleString()}`}
          icon={ChartBarIcon}
          color="primary"
          trend={{ positive: true, value: 8.2 }}
        />
        <Card
          title="Avg. Stock Level"
          value={Math.round(avgStockLevel)}
          icon={ArrowTrendingUpIcon}
          color="secondary"
          trend={{ positive: false, value: 3.1 }}
        />
        <Card
          title="Low Stock Alerts"
          value={lowStockProducts.length}
          icon={ExclamationTriangleIcon}
          color="red"
          trend={{ positive: false, value: 12.5 }}
        />
        <Card
          title="Categories"
          value={new Set(products.map(p => p.category)).size}
          icon={DocumentArrowDownIcon}
          color="accent"
          trend={{ positive: true, value: 5.0 }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Low Stock Alert</h3>
          <div className="space-y-3">
            {lowStockProducts.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No low stock items</p>
            ) : (
              lowStockProducts.map(product => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div>
                    <h4 className="font-medium text-gray-900">{product.name}</h4>
                    <p className="text-sm text-gray-600">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-red-600 font-bold">{product.stock}</span>
                    <span className="text-xs text-gray-500 ml-1">/ {product.lowStockThreshold} min</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Distribution</h3>
          <div className="space-y-3">
            {Array.from(new Set(products.map(p => p.category))).map(category => {
              const categoryProducts = products.filter(p => p.category === category);
              const categoryValue = categoryProducts.reduce((sum, p) => sum + (p.stock * p.price), 0);
              const percentage = ((categoryProducts.length / products.length) * 100).toFixed(1);
              
              return (
                <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{category}</h4>
                    <p className="text-sm text-gray-600">{categoryProducts.length} products</p>
                  </div>
                  <div className="text-right">
                    <span className="text-primary-600 font-bold">${categoryValue.toLocaleString()}</span>
                    <p className="text-xs text-gray-500">{percentage}% of inventory</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Product Performance</h3>
          <button className="btn-secondary text-sm">Export Report</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{product.stock}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">${(product.stock * product.price).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      product.stock <= product.lowStockThreshold
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {product.stock <= product.lowStockThreshold ? 'Low Stock' : 'In Stock'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;