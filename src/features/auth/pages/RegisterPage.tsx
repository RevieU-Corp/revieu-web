import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PATHS } from '../../../routes/paths';
import { authService } from '../api/authService';
import { useAuth } from '../../../contexts/AuthContext';
import { userService } from '../../../api/userService';
import AuthLayout from '../components/AuthLayout';
import AuthSuccessPanel from '../components/AuthSuccessPanel';
import PasswordField from '../components/PasswordField';

interface RegistrationSuccessState {
  target: string;
  note: string;
  heading: string;
  description: string;
  actionLabel: string;
}

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successState, setSuccessState] = useState<RegistrationSuccessState | null>(null);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));

    if (error) {
      setError('');
    }
  };

  const validateForm = () => {
    const { password, confirmPassword } = formData;

    if (password.length < 12) {
      return 'Password must be at least 12 characters long.';
    }

    const specialCharRegex = /[!@#$%^&*(),.?":;{}|<>]/;
    if (!specialCharRegex.test(password)) {
      return 'Password must contain at least one special character (for example !@#$%).';
    }

    if (password !== confirmPassword) {
      return 'Passwords do not match.';
    }

    return null;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      };

      const response = await authService.register(payload);

      if (response.status === 201 || response.data.code === 0) {
        const { token } = response.data;

        if (!token) {
          setSuccessState({
            target: PATHS.AUTH.LOGIN,
            note: 'Registered successfully.',
            heading: 'Registered Successfully',
            description: 'Your account is ready. Use your new credentials to sign in.',
            actionLabel: 'Back to Login',
          });
          return;
        }

        localStorage.setItem('authToken', token);

        const userResponse = await authService.getMe();
        const userData = userResponse.data;

        let profileData = null;
        try {
          const profileResponse = await userService.getProfile();
          profileData = profileResponse.data;
        } catch (profileError) {
          console.log('Profile data not available:', profileError);
        }

        const transformedUser = {
          id: userData.user_id.toString(),
          email: userData.email,
          name: profileData?.nickname || userData.email.split('@')[0],
          avatar: profileData?.avatar_url,
          role: (userData.role === 'merchant' ? 'merchant' : 'user') as 'user' | 'merchant',
        };

        setUser(transformedUser);
        localStorage.setItem('user', JSON.stringify(transformedUser));

        const isMerchant = transformedUser.role === 'merchant';
        setSuccessState({
          target: isMerchant ? PATHS.MERCHANT.DASHBOARD : PATHS.CUSTOMER.HOME,
          note: 'Registered successfully.',
          heading: 'Registered Successfully',
          description: isMerchant
            ? 'Your merchant account is ready. Continue to your dashboard.'
            : 'You can now continue into the RevieU experience.',
          actionLabel: isMerchant ? 'Enter Merchant Portal' : 'Enter RevieU',
        });
      } else {
        setError(response.data.message || 'Registration failed.');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (successState) {
    return (
      <AuthLayout
        title="Success"
        subtitle="Your account has been created successfully."
        backTo={PATHS.AUTH.LOGIN}
        hero={null}
      >
        <AuthSuccessPanel
          note={successState.note}
          heading={successState.heading}
          description={successState.description}
          primaryAction={
            <button className="auth-ui-btn" type="button" onClick={() => navigate(successState.target)}>
              {successState.actionLabel}
            </button>
          }
          secondaryAction={
            <Link className="auth-ui-outline-btn" to={PATHS.AUTH.LOGIN}>
              Back to Login
            </Link>
          }
        />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Register"
      subtitle="Create your account with the details below."
      backTo={PATHS.AUTH.LOGIN}
    >
      {error ? <p className="auth-ui-error">{error}</p> : null}
      <p className="auth-ui-helper">Passwords must be at least 12 characters and include one special character.</p>

      <form className="auth-ui-form" onSubmit={handleSubmit} noValidate>
        <div className="auth-ui-field">
          <label className="auth-ui-label" htmlFor="register-username">
            User name
          </label>
          <input
            className="auth-ui-input"
            id="register-username"
            name="username"
            type="text"
            placeholder="Your user name"
            required
            value={formData.username}
            disabled={isLoading}
            onChange={handleChange}
          />
        </div>

        <div className="auth-ui-field">
          <label className="auth-ui-label" htmlFor="register-email">
            E-mail
          </label>
          <input
            className="auth-ui-input"
            id="register-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            value={formData.email}
            disabled={isLoading}
            onChange={handleChange}
          />
        </div>

        <PasswordField
          id="register-password"
          name="password"
          label="Password"
          placeholder="Create password"
          autoComplete="new-password"
          value={formData.password}
          disabled={isLoading}
          onChange={handleChange}
        />

        <PasswordField
          id="register-confirm-password"
          name="confirmPassword"
          label="Confirm password"
          placeholder="Repeat password"
          autoComplete="new-password"
          value={formData.confirmPassword}
          disabled={isLoading}
          onChange={handleChange}
        />

        <div className="auth-ui-spacer" />

        <button className="auth-ui-btn" type="submit" disabled={isLoading}>
          {isLoading ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <svg className="auth-ui-spinner" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
                <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
              Creating account...
            </span>
          ) : (
            'Register'
          )}
        </button>
      </form>

      <p className="auth-ui-foot-center">
        Already have an account?{' '}
        <Link className="auth-ui-inline-link" to={PATHS.AUTH.LOGIN}>
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default RegisterPage;
