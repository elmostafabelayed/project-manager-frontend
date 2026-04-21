import React from 'react';
import './FormComponents.css';

/**
 * A professional, HeroUI-inspired input component.
 */
export const FormInput = ({
  label,
  name,
  type = 'text',
  placeholder,
  register,
  error,
  required = false,
  className = '',
  ...rest
}) => {
  return (
    <div className="premium-form-group">
      {label && (
        <label htmlFor={name} className="premium-label">
          {label} {required && <span className="required-star">*</span>}
        </label>
      )}
      <div className="premium-input-wrapper">
        <input
          id={name}
          type={type}
          className={`premium-input ${error ? 'is-invalid' : ''} ${className}`}
          placeholder={placeholder}
          {...(register ? register(name) : {})}
          {...rest}
        />
      </div>
      {error && (
        <span className="premium-error-message">
          {error.message}
        </span>
      )}
    </div>
  );
};

/**
 * A professional, HeroUI-inspired textarea component.
 */
export const FormTextArea = ({
  label,
  name,
  placeholder,
  register,
  error,
  required = false,
  rows = 4,
  className = '',
  ...rest
}) => {
  return (
    <div className="premium-form-group">
      {label && (
        <label htmlFor={name} className="premium-label">
          {label} {required && <span className="required-star">*</span>}
        </label>
      )}
      <div className="premium-input-wrapper">
        <textarea
          id={name}
          className={`premium-textarea ${error ? 'is-invalid' : ''} ${className}`}
          placeholder={placeholder}
          rows={rows}
          {...(register ? register(name) : {})}
          {...rest}
        />
      </div>
      {error && (
        <span className="premium-error-message">
          {error.message}
        </span>
      )}
    </div>
  );
};

/**
 * A professional, HeroUI-inspired select component.
 */
export const FormSelect = ({
  label,
  name,
  register,
  error,
  required = false,
  options = [],
  placeholder = "Select an option",
  className = '',
  ...rest
}) => {
  return (
    <div className="premium-form-group">
      {label && (
        <label htmlFor={name} className="premium-label">
          {label} {required && <span className="required-star">*</span>}
        </label>
      )}
      <div className="premium-input-wrapper">
        <select
          id={name}
          className={`premium-select ${error ? 'is-invalid' : ''} ${className}`}
          {...(register ? register(name) : {})}
          {...rest}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((opt) => (
            <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
              {typeof opt === 'string' ? opt : opt.label}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <span className="premium-error-message">
          {error.message}
        </span>
      )}
    </div>
  );
};
