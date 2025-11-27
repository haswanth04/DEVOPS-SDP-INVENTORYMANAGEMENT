import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HomeIcon,
  UsersIcon,
  CubeIcon,
  TruckIcon,
  DocumentChartBarIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, hasAnyRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: HomeIcon,
      roles: ['ADMIN', 'MANAGER', 'STAFF']
    },
    {
      name: 'User Management',
      href: '/users',
      icon: UsersIcon,
      roles: ['ADMIN']
    },
    {
      name: 'System Analytics',
      href: '/reports',
      icon: DocumentChartBarIcon,
      roles: ['ADMIN']
    },
    {
      name: 'Inventory Management',
      href: '/inventory',
      icon: CubeIcon,
      roles: ['MANAGER']
    },
    {
      name: 'Supplier Management',
      href: '/suppliers',
      icon: TruckIcon,
      roles: ['MANAGER']
    },
    {
      name: 'Task Management',
      href: '/task-management',
      icon: ClipboardDocumentListIcon,
      roles: ['MANAGER']
    },
    {
      name: 'Stock Management',
      href: '/stock',
      icon: CubeIcon,
      roles: ['STAFF']
    },
    {
      name: 'My Tasks',
      href: '/tasks',
      icon: ClipboardDocumentListIcon,
      roles: ['STAFF']
    }
  ];

  const filteredMenuItems = menuItems.filter(item =>
    hasAnyRole(item.roles)
  );

  const navItemClasses = ({ isActive }) =>
    `group flex items-center gap-3 px-4 py-2 rounded-2xl text-sm font-medium transition duration-200 ${isActive
      ? 'bg-white/15 text-white shadow-lg shadow-primary-500/20'
      : 'text-white/70 hover:bg-white/10 hover:text-white'
    }`;

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-950 via-slate-950/95 to-slate-950/60 border-r border-white/10 text-white">
      <div className="flex items-center justify-between px-5 py-6 border-b border-white/10">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Inventory Management</h2>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="md:hidden p-2 rounded-full bg-white/5 hover:bg-white/10 transition"
        >
          <XMarkIcon className="h-5 w-5 text-white" />
        </button>
      </div>

      <div className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="mb-8 glass-panel px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center text-lg font-semibold">
              {user?.username?.charAt(0).toUpperCase() || '?'}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{user?.username || 'Guest'}</p>
              <p className="text-xs text-white/60">{user?.role || 'Role pending'}</p>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          {filteredMenuItems.length === 0 ? (
            <div className="text-center py-4 text-white/60 text-sm">
              <p>No menu items</p>
            </div>
          ) : (
            filteredMenuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={navItemClasses}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </NavLink>
            ))
          )}
        </div>
      </div>

      <div className="px-5 py-5 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 btn-secondary"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-white/10 border border-white/20 backdrop-blur transition"
      >
        <Bars3Icon className="h-6 w-6 text-white" />
      </button>

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-slate-950/80 backdrop-blur" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <div className={`md:hidden fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <SidebarContent />
      </div>

      <div className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-30">
        <SidebarContent />
      </div>
    </>
  );
};

export default Sidebar;