import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Table from '../components/UI/Table';
import Modal from '../components/UI/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { apiService } from '../utils/api';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CubeIcon,
  TagIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [viewMode, setViewMode] = useState('table'); // table, grid, analytics
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    stock: 0,
    price: 0,
    lowStockThreshold: 10,
    description: '',
    sku: '',
    supplier: '',
    costPrice: 0,
    reorderPoint: 5
  });

  const { hasAnyRole } = useAuth();

  useEffect(() => {
    if (!hasAnyRole(['ADMIN', 'MANAGER'])) {
      return;
    }
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await apiService.getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || '',
        category: product.category || '',
        stock: product.stock || 0,
        price: product.price || 0,
        lowStockThreshold: product.lowStockThreshold || 10,
        description: product.description || '',
        sku: product.sku || '',
        supplier: product.supplier || '',
        costPrice: product.costPrice || 0,
        reorderPoint: product.reorderPoint || 5
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        category: '',
        stock: 0,
        price: 0,
        lowStockThreshold: 10,
        description: '',
        sku: '',
        supplier: '',
        costPrice: 0,
        reorderPoint: 5
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingProduct) {
        // Update product via API
        const response = await apiService.updateProduct(editingProduct.id, formData);

        // Update local state
        const updatedProducts = products.map(product =>
          product.id === editingProduct.id ? response.data : product
        );
        setProducts(updatedProducts);
        toast.success('Product updated successfully');
      } else {
        // Create product via API
        const response = await apiService.createProduct(formData);
        setProducts([...products, response.data]);
        toast.success('Product created successfully');
      }

      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDelete = async (product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
      try {
        await apiService.deleteProduct(product.id);
        const updatedProducts = products.filter(p => p.id !== product.id);
        setProducts(updatedProducts);
        toast.success('Product deleted successfully');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete product');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedProducts.length} products? This action cannot be undone.`)) {
      try {
        await Promise.all(selectedProducts.map(id => apiService.deleteProduct(id)));
        const updatedProducts = products.filter(p => !selectedProducts.includes(p.id));
        setProducts(updatedProducts);
        setSelectedProducts([]);
        toast.success(`${selectedProducts.length} products deleted successfully`);
      } catch (error) {
        toast.error('Failed to delete some products');
      }
    }
  };

  const handleBulkCategoryChange = async (newCategory) => {
    try {
      await Promise.all(selectedProducts.map(id => {
        const product = products.find(p => p.id === id);
        return apiService.updateProduct(id, { ...product, category: newCategory });
      }));
      const updatedProducts = products.map(product =>
        selectedProducts.includes(product.id)
          ? { ...product, category: newCategory }
          : product
      );
      setProducts(updatedProducts);
      setSelectedProducts([]);
      toast.success(`${selectedProducts.length} products updated to ${newCategory}`);
    } catch (error) {
      toast.error('Failed to update some products');
    }
  };

  const filteredAndSortedProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      const matchesStock = stockFilter === 'all' ||
        (stockFilter === 'low' && product.stock <= product.lowStockThreshold) ||
        (stockFilter === 'out' && product.stock === 0) ||
        (stockFilter === 'in-stock' && product.stock > product.lowStockThreshold);
      return matchesSearch && matchesCategory && matchesStock;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const getInventoryStats = () => {
    const totalProducts = products.length;
    const lowStockProducts = products.filter(p => p.stock <= p.lowStockThreshold).length;
    const outOfStockProducts = products.filter(p => p.stock === 0).length;
    const totalValue = products.reduce((sum, product) => sum + (product.stock * product.price), 0);
    const categories = [...new Set(products.map(p => p.category))].length;

    return {
      totalProducts,
      lowStockProducts,
      outOfStockProducts,
      totalValue,
      categories
    };
  };

  const getCategoryStats = () => {
    const stats = products.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = { count: 0, value: 0, lowStock: 0 };
      }
      acc[product.category].count += 1;
      acc[product.category].value += product.stock * product.price;
      if (product.stock <= product.lowStockThreshold) {
        acc[product.category].lowStock += 1;
      }
      return acc;
    }, {});
    return stats;
  };

  const getTopProducts = () => {
    return products
      .sort((a, b) => (b.stock * b.price) - (a.stock * a.price))
      .slice(0, 5);
  };

  if (!hasAnyRole(['Admin', 'Manager'])) {
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
    return <LoadingSpinner text="Loading inventory..." />;
  }

  const stats = getInventoryStats();
  const categoryStats = getCategoryStats();
  const topProducts = getTopProducts();
  const categories = [...new Set(products.map(p => p.category))];

  const columns = [
    {
      key: 'select',
      title: '',
      render: (product) => (
        <input
          type="checkbox"
          checked={selectedProducts.includes(product.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedProducts([...selectedProducts, product.id]);
            } else {
              setSelectedProducts(selectedProducts.filter(id => id !== product.id));
            }
          }}
          className="rounded border-gray-300"
        />
      )
    },
    {
      key: 'product',
      title: 'Product',
      render: (product) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <CubeIcon className="h-5 w-5 text-gray-500" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{product.name}</div>
            <div className="text-sm text-gray-500">{product.sku || 'No SKU'}</div>
          </div>
        </div>
      )
    },
    {
      key: 'category',
      title: 'Category',
      render: (product) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {product.category}
        </span>
      )
    },
    {
      key: 'stock',
      title: 'Stock',
      render: (product) => (
        <div className="text-center">
          <div className={`font-medium ${product.stock <= product.lowStockThreshold ? 'text-red-600' : 'text-green-600'
            }`}>
            {product.stock}
          </div>
          <div className="text-xs text-gray-500">Min: {product.lowStockThreshold}</div>
        </div>
      )
    },
    {
      key: 'price',
      title: 'Price',
      render: (product) => (
        <div>
          <div className="font-medium">${product.price.toFixed(2)}</div>
          {product.costPrice && (
            <div className="text-xs text-gray-500">Cost: ${product.costPrice.toFixed(2)}</div>
          )}
        </div>
      )
    },
    {
      key: 'value',
      title: 'Total Value',
      render: (product) => `$${(product.stock * product.price).toFixed(2)}`
    },
    {
      key: 'status',
      title: 'Status',
      render: (product) => {
        if (product.stock === 0) {
          return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Out of Stock</span>;
        } else if (product.stock <= product.lowStockThreshold) {
          return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Low Stock</span>;
        } else {
          return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">In Stock</span>;
        }
      }
    }
  ];

  const actions = [
    {
      label: 'View',
      handler: (product) => handleOpenModal(product),
      className: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
      icon: EyeIcon
    },
    {
      label: 'Edit',
      handler: handleOpenModal,
      className: 'bg-blue-100 hover:bg-blue-200 text-blue-700',
      icon: PencilIcon
    },
    {
      label: 'Delete',
      handler: handleDelete,
      className: 'bg-red-100 hover:bg-red-200 text-red-700',
      icon: TrashIcon
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Inventory Management</h1>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setViewMode(viewMode === 'analytics' ? 'table' : 'analytics')}
            className="btn-secondary flex items-center space-x-2"
          >
            <ChartBarIcon className="h-4 w-4" />
            <span>{viewMode === 'analytics' ? 'Table View' : 'Analytics'}</span>
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="btn-primary flex items-center space-x-2"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Analytics View */}
      {viewMode === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="card">
            <div className="flex items-center">
              <CubeIcon className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-gray-900">{stats.lowStockProducts}</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-gray-900">{stats.outOfStockProducts}</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center">
              <ArrowTrendingUpIcon className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalValue.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center">
              <TagIcon className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-gray-900">{stats.categories}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-field w-full sm:w-auto"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="input-field w-full sm:w-auto"
            >
              <option value="all">All Stock</option>
              <option value="in-stock">In Stock</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
            </select>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="input-field w-full sm:w-auto"
            >
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="stock-asc">Stock Low-High</option>
              <option value="stock-desc">Stock High-Low</option>
              <option value="price-asc">Price Low-High</option>
              <option value="price-desc">Price High-Low</option>
            </select>
          </div>
          {selectedProducts.length > 0 && (
            <div className="flex space-x-2">
              <select
                onChange={(e) => handleBulkCategoryChange(e.target.value)}
                className="input-field text-sm"
                defaultValue=""
              >
                <option value="" disabled>Change Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <button
                onClick={handleBulkDelete}
                className="btn-danger text-sm"
              >
                Delete Selected
              </button>
            </div>
          )}
        </div>
      </div>

      <Table
        columns={columns}
        data={filteredAndSortedProducts}
        actions={actions}
        searchable={false}
        pagination={true}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field mt-1"
                required
              />
            </div>

            <div>
              <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
                SKU
              </label>
              <input
                type="text"
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="input-field mt-1"
                placeholder="Product SKU"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category *
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="input-field mt-1"
                required
              >
                <option value="">Select Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Stationery">Stationery</option>
                <option value="Office Supplies">Office Supplies</option>
                <option value="IT Equipment">IT Equipment</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="supplier" className="block text-sm font-medium text-gray-700">
                Supplier
              </label>
              <input
                type="text"
                id="supplier"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                className="input-field mt-1"
                placeholder="Supplier name"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field mt-1"
              rows={3}
              placeholder="Product description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                Current Stock *
              </label>
              <input
                type="number"
                id="stock"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                className="input-field mt-1"
                required
                min="0"
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Selling Price *
              </label>
              <input
                type="number"
                id="price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="input-field mt-1"
                required
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label htmlFor="costPrice" className="block text-sm font-medium text-gray-700">
                Cost Price
              </label>
              <input
                type="number"
                id="costPrice"
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: Number(e.target.value) })}
                className="input-field mt-1"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="lowStockThreshold" className="block text-sm font-medium text-gray-700">
                Low Stock Threshold *
              </label>
              <input
                type="number"
                id="lowStockThreshold"
                value={formData.lowStockThreshold}
                onChange={(e) => setFormData({ ...formData, lowStockThreshold: Number(e.target.value) })}
                className="input-field mt-1"
                required
                min="0"
              />
            </div>

            <div>
              <label htmlFor="reorderPoint" className="block text-sm font-medium text-gray-700">
                Reorder Point
              </label>
              <input
                type="number"
                id="reorderPoint"
                value={formData.reorderPoint}
                onChange={(e) => setFormData({ ...formData, reorderPoint: Number(e.target.value) })}
                className="input-field mt-1"
                min="0"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCloseModal}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              {editingProduct ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Inventory;