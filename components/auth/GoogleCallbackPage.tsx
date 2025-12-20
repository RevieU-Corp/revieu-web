
import React from 'react';
import { Link } from 'react-router-dom';

const GoogleCallbackPage: React.FC = () => {
    return (
        <div 
            className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop')" }}
        >
            <div className="bg-white/90 backdrop-blur-sm p-10 rounded-2xl shadow-2xl max-w-md w-full">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Google Login</h1>
                <p className="text-gray-600 mb-6">Handling Google authentication callback...</p>
                <Link 
                    to="/" 
                    className="inline-block px-6 py-3 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition transform hover:-translate-y-0.5"
                >
                    Back to Login
                </Link>
            </div>
        </div>
    );
};

export default GoogleCallbackPage;
