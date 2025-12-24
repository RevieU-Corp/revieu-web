import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { config } from '../../config';
import axios from 'axios';

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            // In a real app, this would call your password reset API
            const response = await axios.post(`${config.apiBaseUrl}/auth/forgot-password`, {
                email: email
            });

            console.log('Password reset email sent:', response.data);
            setIsSuccess(true);
        } catch (err: any) {
            console.error('Password reset error:', err);
            const message = err.response?.data?.message || 'Failed to send reset email. Please try again.';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div
                className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop')" }}
            >
                <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl max-w-md w-full">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Check Your Email</h1>
                    <p className="text-gray-600 mb-6">
                        We've sent a password reset link to <strong>{email}</strong>
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                        Didn't receive the email? Check your spam folder or try again.
                    </p>
                    <div className="space-y-3">
                        <button
                            onClick={() => {
                                setIsSuccess(false);
                                setEmail('');
                            }}
                            className="w-full px-6 py-3 text-sm font-medium text-[#990000] bg-white border border-[#990000] rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition"
                        >
                            Try Different Email
                        </button>
                        <Link
                            to="/login"
                            className="block w-full px-6 py-3 text-sm font-medium text-white bg-[#990000] rounded-lg hover:bg-[#770000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition text-center"
                        >
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop')" }}
        >
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl max-w-md w-full">
                <div className="flex items-center mb-6">
                    <Link
                        to="/login"
                        className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 flex-1 text-center -ml-9">
                        Reset Password
                    </h1>
                </div>

                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-[#990000]" />
                </div>

                <p className="text-gray-600 mb-6">
                    Enter your email address and we'll send you a link to reset your password.
                </p>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-3 flex items-start gap-2 rounded-md mb-4">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="sr-only">Email address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 text-gray-900 bg-gray-50 border-gray-300 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-colors"
                            placeholder="Enter your email address"
                            disabled={isLoading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !email.trim()}
                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#990000] hover:bg-[#770000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out ${
                            isLoading || !email.trim() ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Sending...
                            </span>
                        ) : (
                            'Send Reset Link'
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link
                        to="/login"
                        className="text-sm font-medium text-[#990000] hover:text-[#770000]"
                    >
                        Remember your password? Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
