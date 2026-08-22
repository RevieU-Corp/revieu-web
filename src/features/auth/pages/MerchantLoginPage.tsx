import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { PATHS } from '../../../routes/paths';
import { authService } from '../api/authService';
import { useAuth } from '../../../contexts/AuthContext';
import { storeProfileService } from '../../merchant/profile/services/storeProfileService';
import PasswordField from '../components/PasswordField';

const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path>
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path>
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.021 35.596 44 30.134 44 24c0-1.341-.138-2.65-.389-3.917z"></path>
    </svg>
);

const MerchantLoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            // Call real backend API through AuthContext
            await login(email, password);

            // Merchant ownership is represented by the backend Merchant/Store
            // relationship, not only by the legacy users.role field. Existing
            // merchant accounts can therefore have a valid store while the
            // auth payload still says role="user".
            const primaryStore = await storeProfileService.getPrimaryStore();
            navigate(primaryStore ? PATHS.MERCHANT.DASHBOARD : PATHS.MERCHANT.VERIFICATION);
        } catch (err: any) {
            console.error('Merchant login error:', err);
            const message = err.response?.data?.message || err.response?.data?.error || 'Login failed. Please check your credentials.';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNewMerchant = () => {
        // Navigate to verification page for new merchants
        navigate(PATHS.MERCHANT.VERIFICATION);
    };

    const handleGoogleLogin = () => {
        window.location.href = authService.getGoogleLoginUrl();
    };

    return (
        <div
            className="flex items-center justify-center min-h-screen px-4 bg-cover bg-center bg-no-repeat transition-all duration-500"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop')" }}
        >
            <div className="w-full max-w-md p-8 space-y-8 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-green-100">
                <div className="text-center">
                    <h1 className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500 drop-shadow-sm pb-1">
                        RevieU
                    </h1>
                    <p className="text-sm font-bold text-green-600 uppercase tracking-widest mb-2">Merchant Portal</p>
                    <p className="mt-1 text-gray-600">Manage your business with RevieU.</p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-3 flex items-start gap-2 rounded-md animate-pulse">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="text-sm font-medium text-gray-700 sr-only">Business Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 text-gray-900 bg-gray-50 border-gray-300 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-colors"
                            placeholder="Business Email"
                            disabled={isLoading}
                        />
                    </div>

                    <PasswordField
                        id="password"
                        name="password"
                        label="Password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        disabled={isLoading}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <div className="text-right">
                        <Link to={PATHS.AUTH.FORGOT_PASSWORD} d-link="forgot-password" className="text-sm font-medium text-green-600 hover:text-green-500">
                            Forgot password?
                        </Link>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out transform hover:-translate-y-0.5 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                'Merchant Sign in'
                            )}
                        </button>
                    </div>
                </form>

                <div className="flex items-center justify-center space-x-4">
                    <div className="h-px bg-gray-300 flex-1"></div>
                    <span className="text-sm text-gray-500">Or continue with</span>
                    <div className="h-px bg-gray-300 flex-1"></div>
                </div>

                <div>
                    <button
                        onClick={handleGoogleLogin}
                        type="button"
                        disabled={isLoading}
                        className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out transform hover:-translate-y-0.5"
                    >
                        <GoogleIcon />
                        Sign in with Google
                    </button>
                </div>

                <div className="pt-4 flex flex-col space-y-4 items-center">
                    <div className="text-sm">
                        <span className="text-gray-600">Don't have a business account? </span>
                        <button 
                            disabled
                            className="font-medium text-white bg-green-400 px-2 py-1 rounded cursor-not-allowed"
                            title="For customer registration to leave reviews, visit /customer/home and use the regular login/register flow"
                        >
                            Get Started
                        </button>
                    </div>

                    {/* New Merchant Button */}
                    <button
                        onClick={handleNewMerchant}
                        disabled={isLoading}
                        className="w-full py-3 px-4 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        I am a new merchant
                    </button>

                    <button
                        onClick={() => navigate(PATHS.AUTH.LOGIN)}
                        className="text-sm font-semibold text-gray-700 hover:text-red-600 flex items-center gap-1 transition-colors"
                    >
                        我是普通用户 (I am a User) →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MerchantLoginPage;
