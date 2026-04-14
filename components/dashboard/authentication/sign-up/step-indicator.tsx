import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

const StepIndicator = ({ currentStep, totalSteps, labels }: StepIndicatorProps) => {
  return (
    <div className="mb-8">
      <div className="relative flex items-center justify-between">
        {/*==================== Background Progress Bar ====================*/}
        <div className="absolute left-0 top-1/2 h-1 -translate-y-1/2 w-full bg-gray-200 rounded-full">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
            }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="h-full bg-linear-to-r from-blue-600 to-blue-700 rounded-full"
          />
        </div>
        {/*==================== End of Background Progress Bar ====================*/}

        {/*==================== Step Circles ====================*/}
        {Array.from({ length: totalSteps }).map((_, index) => {
          const isCompleted = index < currentStep - 1;
          const isCurrent = index === currentStep - 1;

          return (
            <motion.div
              key={index}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.2, duration: 0.3 }}
              className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full ${
                isCompleted
                  ? 'bg-blue-700 text-white'
                  : isCurrent
                    ? 'bg-white ring-2 ring-blue-700 text-blue-700'
                    : 'bg-white ring-2 ring-gray-200 text-gray-400'
              } transition-all duration-300 shadow-md`}
            >
              {isCompleted ? (
                <Check className="h-5 w-5" />
              ) : (
                <span className="text-sm font-semibold">{index + 1}</span>
              )}

              {/*==================== Pulse Animation For Current Step ====================*/}
              {isCurrent && (
                <div className="absolute inset-0 rounded-full animate-ping bg-blue-700/30" />
              )}
              {/*==================== End of Pulse Animation For Current Step ====================*/}
            </motion.div>
          );
        })}
        {/*==================== End of Step Circles ====================*/}
      </div>

      {/*==================== Labels ====================*/}
      <div className="flex justify-between mt-2 px-1.5">
        {labels.map((label, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className={`text-xs font-medium ${
              index < currentStep ? 'text-blue-700' : 'text-gray-500'
            } transition-colors duration-300 text-center w-20 -ml-5 ${
              index === labels.length - 1 ? 'text-right -mr-5' : index === 0 ? 'text-left' : ''
            }`}
          >
            {label}
          </motion.span>
        ))}
      </div>
      {/*==================== End of Labels ====================*/}
    </div>
  );
};

export default StepIndicator;
