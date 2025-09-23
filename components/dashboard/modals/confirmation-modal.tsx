import { X, AlertTriangle, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConfirmationModalProps } from '@/types/interfaces/modal';

const ConfirmationModal = ({
  icon,
  title,
  message,
  isOpen,
  onClose,
  onConfirm,
  confirmText,
  loadingText,
  isLoading = false,
  variant = 'primary',
  cancelText = 'Cancel',
}: ConfirmationModalProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          buttonBg: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
        };
      case 'success':
        return {
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600',
          buttonBg: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
        };
      case 'warning':
        return {
          iconBg: 'bg-yellow-100',
          iconColor: 'text-yellow-600',
          buttonBg: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
        };
      default:
        return {
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          buttonBg: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
        };
    }
  };

  const styles = getVariantStyles();
  const defaultIcon = <AlertTriangle className="h-5 w-5" />;
  const displayIcon = icon || defaultIcon;
  const displayLoadingText = loadingText || `${confirmText}...`;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/*==================== Background Overlay ====================*/}
          <motion.div
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            onClick={!isLoading ? onClose : undefined}
            className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
          />
          {/*==================== End of Background Overlay ====================*/}

          {/*==================== Modal Content ====================*/}
          <motion.div
            className="relative w-full max-w-md rounded-xl bg-white shadow-2xl"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{
              damping: 20,
              duration: 0.3,
              type: 'spring',
              stiffness: 300,
            }}
          >
            <div className="p-6">
              {/*==================== Modal Header ====================*/}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className={`mr-3 flex h-10 w-10 items-center justify-center rounded-full ${styles.iconBg}`}
                  >
                    <span className={styles.iconColor}>{displayIcon}</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {/*==================== End of Modal Header ====================*/}

              {/*==================== Modal Content ====================*/}
              <div className="mb-6">
                <p className="text-md text-gray-600">{message}</p>
              </div>
              {/*==================== End of Modal Content ====================*/}

              {/*==================== Action Buttons ====================*/}
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cancelText}
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={`flex-1 inline-flex justify-center items-center rounded-lg px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${styles.buttonBg}`}
                >
                  {isLoading ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      {displayLoadingText}
                    </>
                  ) : (
                    confirmText
                  )}
                </button>
              </div>
              {/*==================== End of Action Buttons ====================*/}
            </div>
          </motion.div>
          {/*==================== End of Modal Content ====================*/}
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;
