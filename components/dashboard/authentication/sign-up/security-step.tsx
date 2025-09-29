import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AuthButton from '../auth-button';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { SecurityStepProps } from '@/types/interfaces/auth';
import PasswordStrengthIndicator from './password-strength-indicator';

const SecurityStep = ({
  formData,
  onChange,
  onPrevious,
  isLoading,
  showPassword,
  showConfirmPassword,
  toggleShowPassword,
  toggleShowConfirmPassword,
}: SecurityStepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 70 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 1 }}
    >
      <div className="mb-6">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            required
            id="password"
            name="password"
            onChange={onChange}
            placeholder="••••••••"
            value={formData.password}
            type={showPassword ? 'text' : 'password'}
            className="pl-10 w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={toggleShowPassword}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>

        {/* Password strength indicator */}
        <PasswordStrengthIndicator password={formData.password} />
      </div>

      <div className="mb-6">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
          Confirm Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            required
            onChange={onChange}
            id="confirmPassword"
            name="confirmPassword"
            placeholder="••••••••"
            value={formData.confirmPassword}
            type={showConfirmPassword ? 'text' : 'password'}
            className="pl-10 w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all"
          />
          <button
            type="button"
            onClick={toggleShowConfirmPassword}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showConfirmPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
        {formData.password &&
          formData.confirmPassword &&
          formData.password !== formData.confirmPassword && (
            <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
          )}
      </div>

      <div className="mb-8">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="agreeToTerms"
            onChange={onChange}
            checked={formData.agreeToTerms}
            className="h-4 w-4 text-blue-700 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-600">
            I agree to the{' '}
            <Link href="/terms" className="text-blue-700 hover:text-blue-500 underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-blue-700 hover:text-blue-500 underline">
              Privacy Policy
            </Link>
          </span>
        </label>
      </div>

      <div className="flex space-x-4">
        <AuthButton variant="secondary" onClick={onPrevious} fullWidth={false} className="w-1/3">
          Back
        </AuthButton>

        <AuthButton
          type="submit"
          isLoading={isLoading}
          loadingText="Creating account..."
          fullWidth={false}
          className="w-2/3"
        >
          Create account
        </AuthButton>
      </div>
    </motion.div>
  );
};

export default SecurityStep;
