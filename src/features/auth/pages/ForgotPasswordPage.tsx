import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { PATHS } from '../../../routes/paths';
import { authService } from '../api/authService';
import AuthLayout from '../components/AuthLayout';
import AuthSuccessPanel from '../components/AuthSuccessPanel';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await authService.forgotPassword(email);
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
      <AuthLayout
        title="Success"
        subtitle="Your password reset request has been received."
        backTo={PATHS.AUTH.LOGIN}
        hero={null}
      >
        <AuthSuccessPanel
          note={`Reset link sent to ${email}.`}
          heading="Check Your Email"
          description="Use the link in your inbox to reset your password. If it does not arrive soon, check your spam folder or try again."
          primaryAction={
            <Link className="auth-ui-btn" to={PATHS.AUTH.LOGIN}>
              Back to Login
            </Link>
          }
          secondaryAction={
            <button className="auth-ui-outline-btn" type="button" onClick={() => setIsSuccess(false)}>
              Try Different Email
            </button>
          }
        />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Enter your e-mail and we will send a reset link."
      backTo={PATHS.AUTH.LOGIN}
      hero={<div className="auth-ui-hero-badge">@</div>}
    >
      {error ? <p className="auth-ui-error">{error}</p> : null}

      <form className="auth-ui-form" onSubmit={handleSubmit} noValidate>
        <div className="auth-ui-field">
          <label className="auth-ui-label" htmlFor="forgot-email">
            E-mail
          </label>
          <input
            className="auth-ui-input"
            id="forgot-email"
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

        <div className="auth-ui-spacer" />

        <button className="auth-ui-btn" type="submit" disabled={isLoading || !email.trim()}>
          {isLoading ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <svg className="auth-ui-spinner" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
                <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
              Sending...
            </span>
          ) : (
            'Reset Password'
          )}
        </button>
      </form>

      <p className="auth-ui-foot-center">
        <Link className="auth-ui-link" to={PATHS.AUTH.LOGIN}>
          Back to Login
        </Link>
      </p>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
