import React from 'react';
import { AuthButtonProps } from '@/types/interfaces/auth';

const AuthButton = ({
  onClick,
  children,
  className = '',
  type = 'button',
  disabled = false,
  fullWidth = true,
  isLoading = false,
  variant = 'primary',
  loadingText = 'Loading...',
}: AuthButtonProps) => {
  if (variant === 'primary') {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#0A1628] px-5 py-3 text-sm font-semibold text-[#FF6A00] transition hover:brightness-110 active:scale-[0.98] focus:outline-none cursor-pointer disabled:opacity-70 ${
          fullWidth ? 'w-full' : ''
        } ${className}`}
      >
        {isLoading ? loadingText : children}
      </button>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-[#0A1628]/20 bg-white px-5 py-3 text-sm font-semibold text-[#0A1628] transition hover:bg-[#0A1628]/5 focus:outline-none cursor-pointer disabled:opacity-70 ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
    >
      {isLoading ? loadingText : children}
    </button>
  );
};

export default AuthButton;
