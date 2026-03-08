import type { ReactNode } from 'react';

interface AuthSuccessPanelProps {
  note: string;
  heading: string;
  description: string;
  primaryAction: ReactNode;
  secondaryAction?: ReactNode;
}

const AuthSuccessPanel = ({
  note,
  heading,
  description,
  primaryAction,
  secondaryAction,
}: AuthSuccessPanelProps) => {
  return (
    <>
      <div className="auth-ui-success-note">{note}</div>

      <div className="auth-ui-success-hero" aria-hidden="true">
        <svg className="auth-ui-mail" viewBox="0 0 96 68" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="16" width="80" height="44" rx="4" fill="#c31711" />
          <path d="M8 18L48 44L88 18" fill="#df7f13" />
          <path d="M8 60L37 38L48 46L59 38L88 60" fill="#b80f0a" />
          <rect x="38" y="8" width="20" height="14" rx="2" fill="#f2be2f" />
          <path d="M40 14L48 20L56 14" stroke="#7f4d00" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h3 className="auth-ui-success-title">{heading}</h3>
      <p className="auth-ui-success-text">{description}</p>

      <div className="auth-ui-actions">
        {primaryAction}
        {secondaryAction}
      </div>
    </>
  );
};

export default AuthSuccessPanel;
