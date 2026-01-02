import { useNavigate, Outlet } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const CustomerLayout: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToEntry = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header with back button */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <button
          onClick={handleBackToEntry}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back to Entry</span>
        </button>
      </header>

      {/* Main content */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default CustomerLayout;