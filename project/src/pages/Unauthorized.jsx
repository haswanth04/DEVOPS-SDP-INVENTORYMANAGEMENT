import { Link } from 'react-router-dom';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <ExclamationTriangleIcon className="h-20 w-20 text-red-500" />
        </div>
        <div className="text-center mt-6">
          <h2 className="text-3xl font-bold text-gray-900">Access Denied</h2>
          <p className="mt-4 text-lg text-gray-600">
            You don't have permission to access this resource.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Please contact your administrator if you believe this is an error.
          </p>
          <div className="mt-8">
            <Link
              to="/dashboard"
              className="btn-primary"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;