import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Table from '../components/UI/Table';
import Modal from '../components/UI/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { apiService } from '../utils/api';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    phone: ''
  });

  const { hasAnyRole } = useAuth();

  useEffect(() => {
    if (!hasAnyRole(['ADMIN', 'MANAGER'])) {
      return;
    }
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await apiService.getSuppliers();
      setSuppliers(response.data);
    } catch (error) {
      console.error('Failed to fetch suppliers:', error);
      toast.error('Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (supplier = null) => {
    if (supplier) {
      setEditingSupplier(supplier);
      setFormData({
        name: supplier.name,
        contact: supplier.contact,
        email: supplier.email,
        phone: supplier.phone
      });
    } else {
      setEditingSupplier(null);
      setFormData({
        name: '',
        contact: '',
        email: '',
        phone: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSupplier(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingSupplier) {
        // Update supplier via API
        const response = await apiService.updateSupplier(editingSupplier.id, formData);

        // Update local state
        const updatedSuppliers = suppliers.map(supplier =>
          supplier.id === editingSupplier.id ? response.data : supplier
        );
        setSuppliers(updatedSuppliers);
        toast.success('Supplier updated successfully');
      } else {
        // Create supplier via API
        const response = await apiService.createSupplier(formData);
        setSuppliers([...suppliers, response.data]);
        toast.success('Supplier created successfully');
      }

      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save supplier');
    }
  };

  const handleDelete = async (supplier) => {
    if (window.confirm(`Are you sure you want to delete "${supplier.name}"? This action cannot be undone.`)) {
      try {
        await apiService.deleteSupplier(supplier.id);
        const updatedSuppliers = suppliers.filter(s => s.id !== supplier.id);
        setSuppliers(updatedSuppliers);
        toast.success('Supplier deleted successfully');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete supplier');
      }
    }
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
    return <LoadingSpinner text="Loading suppliers..." />;
  }

  const columns = [
    { key: 'name', title: 'Company Name' },
    { key: 'contact', title: 'Contact Person' },
    { key: 'email', title: 'Email' },
    { key: 'phone', title: 'Phone' }
  ];

  const actions = [
    {
      label: 'Edit',
      handler: handleOpenModal,
      className: 'bg-blue-100 hover:bg-blue-200 text-blue-700'
    },
    {
      label: 'Delete',
      handler: handleDelete,
      className: 'bg-red-100 hover:bg-red-200 text-red-700'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Suppliers Management</h1>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn-primary"
        >
          Add New Supplier
        </button>
      </div>

      <Table
        columns={columns}
        data={suppliers}
        actions={actions}
        searchable={true}
        pagination={true}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Company Name
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
            <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
              Contact Person
            </label>
            <input
              type="text"
              id="contact"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              className="input-field mt-1"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input-field mt-1"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="input-field mt-1"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
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
              {editingSupplier ? 'Update Supplier' : 'Create Supplier'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Suppliers;