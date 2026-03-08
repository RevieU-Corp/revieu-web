import { useState, type ChangeEvent } from 'react';

interface PasswordFieldProps {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  autoComplete?: string;
  value: string;
  disabled?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const PasswordField = ({
  id,
  name,
  label,
  placeholder,
  autoComplete,
  value,
  disabled = false,
  onChange,
}: PasswordFieldProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="auth-ui-field auth-ui-password">
      <label className="auth-ui-label" htmlFor={id}>
        {label}
      </label>
      <div className="auth-ui-password-control">
        <input
          className="auth-ui-input"
          id={id}
          name={name}
          type={visible ? 'text' : 'password'}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
          value={value}
          disabled={disabled}
          onChange={onChange}
        />
        <button
          className="auth-ui-toggle"
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? 'Hide' : 'Show'}
        </button>
      </div>
    </div>
  );
};

export default PasswordField;
