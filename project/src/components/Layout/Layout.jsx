import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';

const Layout = () => {
  const { user } = useAuth();
  const normalizedRole = user?.role?.toUpperCase();

  return (
    <div className="workspace-shell">
      <Sidebar />
      <div className="workspace-main md:ml-72">
        <header className="workspace-topbar">
          <div className="space-y-1">
            {/* Page title placeholder or breadcrumbs could go here */}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-3 glass-panel px-4 py-3">
              <div className="w-10 h-10 rounded-2xl bg-primary-500 flex items-center justify-center text-white font-semibold">
                {user?.username?.charAt(0).toUpperCase() || '?'}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{user?.username || 'Guest'}</p>
                <p className="text-xs text-white/60">{user?.role || 'Role pending'}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="workspace-content">
          <Outlet />
        </main>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(15,23,42,0.9)',
            color: '#fff',
            borderRadius: '14px',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.12)'
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff'
            }
          },
          error: {
            iconTheme: {
              primary: '#f43f5e',
              secondary: '#fff'
            }
          },
        }}
      />
    </div>
  );
};

export default Layout;