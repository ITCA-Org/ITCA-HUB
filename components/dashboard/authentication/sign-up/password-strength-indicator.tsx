import React from 'react';
import { CheckCircle } from 'lucide-react';
import {
  calculatePasswordStrength,
  getPasswordStrengthText,
  getPasswordStrengthColor,
} from '@/utils/sign-up/password-strength';

interface PasswordStrengthIndicatorProps {
  password: string;
}

const PasswordStrengthIndicator = ({ password }: PasswordStrengthIndicatorProps) => {
  const strength = calculatePasswordStrength(password);

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs font-medium text-gray-600">Password strength:</div>
        <div
          className={`text-xs font-medium ${
            strength <= 1
              ? 'text-red-600'
              : strength === 2
                ? 'text-yellow-600'
                : strength === 3
                  ? 'text-blue-500'
                  : 'text-green-600'
          }`}
        >
          {getPasswordStrengthText(strength)}
        </div>
      </div>
      <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${getPasswordStrengthColor(strength)}`}
          style={{ width: `${strength * 25}%` }}
        ></div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-2">
        <div className="flex items-center text-xs text-gray-600">
          <CheckCircle
            className={`h-3 w-3 mr-1 ${password.length >= 8 ? 'text-green-500' : 'text-gray-400'}`}
          />
          <span>At least 8 characters</span>
        </div>
        <div className="flex items-center text-xs text-gray-600">
          <CheckCircle
            className={`h-3 w-3 mr-1 ${
              /[A-Z]/.test(password) ? 'text-green-500' : 'text-gray-400'
            }`}
          />
          <span>Uppercase letter</span>
        </div>
        <div className="flex items-center text-xs text-gray-600">
          <CheckCircle
            className={`h-3 w-3 mr-1 ${
              /[0-9]/.test(password) ? 'text-green-500' : 'text-gray-400'
            }`}
          />
          <span>Number</span>
        </div>
        <div className="flex items-center text-xs text-gray-600">
          <CheckCircle
            className={`h-3 w-3 mr-1 ${
              /[^A-Za-z0-9]/.test(password) ? 'text-green-500' : 'text-gray-400'
            }`}
          />
          <span>Special character</span>
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
