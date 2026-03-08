import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import '../styles/auth-ui.css';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  backTo?: string;
  hero?: ReactNode;
}

const DefaultHero = () => <div className="auth-ui-hero-badge">R</div>;

const AuthLayout = ({
  title,
  subtitle,
  children,
  backTo,
  hero,
}: AuthLayoutProps) => {
  const resolvedHero = hero === undefined ? <DefaultHero /> : hero;

  return (
    <main className="auth-ui-page">
      <div className="auth-ui-shell">
        <section className="auth-ui-card" aria-live="polite">
          <div className="auth-ui-body">
            <div className="auth-ui-title-row">
              {backTo ? (
                <Link className="auth-ui-icon-btn" to={backTo} aria-label="Back">
                  <ArrowLeft size={18} />
                </Link>
              ) : null}
              <h2 className="auth-ui-title">{title}</h2>
            </div>
            <p className="auth-ui-subtitle">{subtitle}</p>

            {resolvedHero ? (
              <div className="auth-ui-hero" aria-hidden="true">
                {resolvedHero}
              </div>
            ) : null}

            {children}
          </div>
        </section>
      </div>
    </main>
  );
};

export default AuthLayout;
