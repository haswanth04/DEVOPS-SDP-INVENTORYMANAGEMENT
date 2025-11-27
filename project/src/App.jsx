import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout/Layout';


import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Inventory from './pages/Inventory';
import Stock from './pages/Stock';
import Suppliers from './pages/Suppliers';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import TaskManagement from './pages/TaskManagement';
import StaffTasks from './pages/StaffTasks';
import Unauthorized from './pages/Unauthorized';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected routes with layout */}
          <Route element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }>
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Common routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<Settings />} />

            {/* ADMIN ONLY ROUTES */}
            <Route
              path="/users"
              element={<Users />}
            />
            <Route
              path="/reports"
              element={<Reports />}
            />
            <Route
              path="/settings"
              element={<Settings />}
            />

            {/* MANAGER ONLY ROUTES */}
            <Route
              path="/inventory"
              element={<Inventory />}
            />
            <Route
              path="/suppliers"
              element={<Suppliers />}
            />
            <Route
              path="/task-management"
              element={<TaskManagement />}
            />

            {/* STAFF ONLY ROUTES */}
            <Route
              path="/stock"
              element={<Stock />}
            />
            <Route
              path="/tasks"
              element={<StaffTasks />}
            />
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;