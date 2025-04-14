
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-admin-background">
      <div className="bg-white p-8 rounded-lg shadow-card text-center max-w-md">
        <div className="flex justify-center mb-4">
          <div className="bg-amber-100 p-3 rounded-full">
            <AlertTriangle size={48} className="text-amber-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <h2 className="text-xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex justify-center space-x-4">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
          >
            Go Back
          </Button>
          <Button
            onClick={() => navigate('/dashboard')}
            className="bg-admin-primary hover:bg-admin-secondary"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
