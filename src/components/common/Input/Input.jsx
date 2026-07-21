import React, { forwardRef } from 'react';

export const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      type = 'text',
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input_${Math.random().toString(36).substring(2, 7)}`;

    return (
      <div className="mb-3 text-start">
        {label && (
          <label htmlFor={inputId} className="form-label fw-medium fs-7 mb-1 text-main">
            {label}
          </label>
        )}
        <div className="input-group">
          {leftIcon && (
            <span className="input-group-text bg-body-custom border-custom text-muted-custom">
              <i className={`bi ${leftIcon}`}></i>
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            type={type}
            className={`form-control ${error ? 'is-invalid' : ''} ${className}`}
            {...props}
          />
          {rightIcon && (
            <span className="input-group-text bg-body-custom border-custom text-muted-custom">
              <i className={`bi ${rightIcon}`}></i>
            </span>
          )}
          {error && <div className="invalid-feedback">{error}</div>}
        </div>
        {helperText && !error && <small className="text-muted-custom fs-8 mt-1 d-block">{helperText}</small>}
      </div>
    );
  }
);

Input.displayName = 'Input';
