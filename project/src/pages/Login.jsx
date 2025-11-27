import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  ShieldCheckIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: ''
  });
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from?.pathname || '/dashboard';

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username.trim()) {
      toast.error('Username or email is required');
      return;
    }

    if (!formData.password) {
      toast.error('Password is required');
      return;
    }

    if (!formData.role) {
      toast.error('Please select a role');
      return;
    }

    setLoading(true);

    try {
      const loginData = {
        ...formData,
        role: formData.role.toUpperCase()
      };

      const result = await login(loginData);

      if (result.success) {
        toast.success('Login successful!');
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 120);
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="auth-gradient">
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="px-6 sm:px-12 pt-10 flex items-center justify-between text-white/80">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight mt-3">Inventory Management</h1>
          </div>
          <Link to="/register" className="text-sm font-medium hover:text-white transition">
            New to the platform?
          </Link>
        </header>

        <main className="flex-1 w-full px-6 sm:px-12 py-10 flex flex-col justify-center items-center">
          {/* Side panel removed for cleaner UI */}

          <section className="w-full lg:max-w-lg">
            <div className="auth-card p-10 space-y-8">
              <div className="space-y-3">
                <div>
                  <h2 className="text-3xl font-semibold text-slate-900">Sign in</h2>
                </div>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="username" className="auth-label">
                    Work email or username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="auth-input"
                    placeholder="you@company.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="auth-label">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="auth-input"
                    placeholder="Enter strong password"
                  />
                </div>

                <div>
                  <label htmlFor="role" className="auth-label">
                    Choose workspace role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="auth-input bg-white"
                    required
                  >
                    <option value="">Select your role</option>
                    <option value="Staff">Staff • update stock & log tasks</option>
                    <option value="Manager">Manager • oversee inventory & suppliers</option>
                    <option value="Admin">Admin • full system access</option>
                  </select>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="inline-flex items-center gap-2 text-gray-600">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    Keep me signed in
                  </label>
                  <button
                    type="button"
                    className="font-medium text-primary-600 hover:text-primary-700 transition"
                  >
                    Need help?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex justify-center items-center py-3 text-base"
                >
                  {loading ? <LoadingSpinner size="small" text="" /> : 'Access workspace'}
                </button>
              </form>

              <div className="flex items-center gap-3 text-sm">
                <CheckCircleIcon className="w-5 h-5 text-primary-500" />
                <p className="text-gray-500">
                  Protected by adaptive MFA, device trust, and activity alerts.
                </p>
              </div>

              <p className="text-center text-sm text-gray-500">
                Need a new workspace?{' '}
                <Link to="/register" className="text-primary-600 font-medium hover:text-primary-700">
                  Create an account
                </Link>
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Login;