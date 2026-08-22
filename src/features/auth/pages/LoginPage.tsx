import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PATHS } from '../../../routes/paths';
import { authService } from '../api/authService';
import { useAuth } from '../../../contexts/AuthContext';
import AuthLayout from '../components/AuthLayout';
import GoogleIcon from '../components/GoogleIcon';
import PasswordField from '../components/PasswordField';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!EMAIL_PATTERN.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);

      const storedUser = localStorage.getItem('user');
      const user = storedUser ? JSON.parse(storedUser) : null;
      const destination = user?.role === 'merchant' ? PATHS.MERCHANT.DASHBOARD : PATHS.CUSTOMER.HOME;
      navigate(destination);
    } catch (err: any) {
      console.error('Login error:', err);
      const message = err.response?.data?.message || err.response?.data?.error || 'Login failed. Please check your credentials.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = authService.getGoogleLoginUrl();
  };

  return (
    <AuthLayout
      title="Log In / Sign Up"
      subtitle="Access your account or continue with Google."
    >
      {error ? <p className="auth-ui-error">{error}</p> : null}

      <form className="auth-ui-form" onSubmit={handleSubmit} noValidate>
        <div className="auth-ui-field">
          <label className="auth-ui-label" htmlFor="login-email">
            E-mail
          </label>
          <input
            className="auth-ui-input"
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            value={email}
            disabled={isLoading}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <PasswordField
          id="login-password"
          name="password"
          label="Password"
          placeholder="Enter password"
          autoComplete="current-password"
          value={password}
          disabled={isLoading}
          onChange={(event) => setPassword(event.target.value)}
        />

        <div className="auth-ui-row-between">
          <span>
            No account?{' '}
            <Link className="auth-ui-inline-link" to={PATHS.AUTH.REGISTER}>
              Register
            </Link>
          </span>
          <Link className="auth-ui-inline-link" to={PATHS.AUTH.FORGOT_PASSWORD}>
            Forgot password?
          </Link>
        </div>

        <div className="auth-ui-spacer" />

        <button className="auth-ui-btn" type="submit" disabled={isLoading}>
          {isLoading ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <svg className="auth-ui-spinner" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
                <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
              Signing in...
            </span>
          ) : (
            'Login'
          )}
        </button>

        <div className="auth-ui-divider">or continue with</div>

        <button className="auth-ui-google-btn" type="button" disabled={isLoading} onClick={handleGoogleLogin}>
          <GoogleIcon />
          Google
        </button>
      </form>

      <p className="auth-ui-foot-center">
        Merchant portal?{' '}
        <Link className="auth-ui-inline-link" to={PATHS.MERCHANT.LOGIN}>
          I am a merchant
        </Link>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;
