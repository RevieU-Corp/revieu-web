import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PATHS } from '../../../routes/paths';
import { useAuth } from '../../../contexts/AuthContext';
import { authService } from '../api/authService';

const GoogleCallbackPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(true);

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Extract token from URL query parameter
                const token = searchParams.get('token');

                if (!token) {
                    setError('No authentication token received');
                    setIsProcessing(false);
                    return;
                }

                // Store token in localStorage
                localStorage.setItem('authToken', token);

                // Fetch user profile using the token
                const response = await authService.getMe();
                const userData = response.data;

                // Transform backend user data to frontend User format
                const transformedUser = {
                    id: userData.user_id.toString(),
                    email: userData.email,
                    name: userData.email.split('@')[0],
                    role: (userData.role === 'merchant' ? 'merchant' : 'user') as 'user' | 'merchant',
                };

                // Update auth context
                setUser(transformedUser);
                localStorage.setItem('user', JSON.stringify(transformedUser));

                // Redirect based on user role
                if (transformedUser.role === 'merchant') {
                    navigate(PATHS.MERCHANT.DASHBOARD);
                } else {
                    navigate(PATHS.CUSTOMER.HOME);
                }
            } catch (err: any) {
                console.error('OAuth callback error:', err);
                setError(err.response?.data?.message || 'Authentication failed. Please try again.');
                setIsProcessing(false);
            }
        };

        handleCallback();
    }, [searchParams, navigate, setUser]);

    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop')" }}
        >
            <div className="bg-white/90 backdrop-blur-sm p-10 rounded-2xl shadow-2xl max-w-md w-full">
                {isProcessing ? (
                    <>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Authenticating...</h1>
                        <p className="text-gray-600">Please wait while we complete your login.</p>
                    </>
                ) : error ? (
                    <>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Authentication Failed</h1>
                        <p className="text-red-600 mb-6">{error}</p>
                        <button
                            onClick={() => navigate(PATHS.AUTH.LOGIN)}
                            className="inline-block px-6 py-3 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition transform hover:-translate-y-0.5"
                        >
                            Back to Login
                        </button>
                    </>
                ) : null}
            </div>
        </div>
    );
};

export default GoogleCallbackPage;