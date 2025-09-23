import { X, AlertTriangle, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DeleteResourceModalProps } from '@/types/interfaces/modal';

const DeleteResourceModal = ({
  isOpen,
  onClose,
  onConfirm,
  mode = 'soft',
  resourceCount,
  isLoading = false,
}: DeleteResourceModalProps) => {
  const isSingleResource = resourceCount === 1;

  const getModalContent = () => {
    switch (mode) {
      case 'restore':
        return {
          title: `Restore ${isSingleResource ? 'Resource' : `${resourceCount} Resources`}`,
          description: `Are you sure you want to restore ${
            isSingleResource ? 'this resource' : `these ${resourceCount} resources`
          }? ${isSingleResource ? 'It' : 'They'} will be moved back to the main resources list.`,
          warningText: isSingleResource
            ? 'This resource will be restored to the main resources list'
            : `${resourceCount} resources will be restored to the main resources list`,
          buttonText: isLoading ? 'Restoring...' : 'Restore',
          buttonColor: 'bg-green-500 hover:bg-green-600 focus:ring-green-500',
          iconColor: 'bg-green-100',
          iconTextColor: 'text-green-600',
          warningBgColor: 'bg-green-50',
          warningBorderColor: 'border-green-100',
          warningIconColor: 'text-green-500',
        };
      case 'permanent':
        return {
          title: `Permanently Delete ${isSingleResource ? 'Resource' : `${resourceCount} Resources`}`,
          description: `Are you sure you want to permanently delete ${
            isSingleResource ? 'this resource' : `these ${resourceCount} resources`
          }? This action cannot be undone and ${
            isSingleResource ? 'the resource' : 'all resources'
          } will be lost forever.`,
          warningText: isSingleResource
            ? 'This resource will be permanently deleted and cannot be recovered'
            : `${resourceCount} resources will be permanently deleted and cannot be recovered`,
          buttonText: isLoading ? 'Deleting Forever...' : 'Delete Permanently',
          buttonColor: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
          iconColor: 'bg-red-100',
          iconTextColor: 'text-red-600',
          warningBgColor: 'bg-red-50',
          warningBorderColor: 'border-red-100',
          warningIconColor: 'text-red-500',
        };
      default:
        return {
          title: `Move ${isSingleResource ? 'Resource' : `${resourceCount} Resources`} to Recycle Bin`,
          description: `Are you sure you want to move ${
            isSingleResource ? 'this resource' : `these ${resourceCount} resources`
          } to the recycle bin? ${isSingleResource ? 'It' : 'They'} can be restored later if needed.`,
          warningText: isSingleResource
            ? 'This resource will be moved to the recycle bin and can be restored within 30 days'
            : `${resourceCount} resources will be moved to the recycle bin and can be restored within 30 days`,
          buttonText: isLoading ? 'Moving to Recycle Bin...' : 'Move to Recycle Bin',
          buttonColor: 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-500',
          iconColor: 'bg-amber-100',
          iconTextColor: 'text-amber-600',
          warningBgColor: 'bg-amber-50',
          warningBorderColor: 'border-amber-100',
          warningIconColor: 'text-amber-500',
        };
    }
  };

  const content = getModalContent();

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/*==================== Background Overlay ====================*/}
          <motion.div
            onClick={!isLoading ? onClose : undefined}
            className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          {/*==================== End of Background Overlay ====================*/}

          {/*==================== Modal Content ====================*/}
          <motion.div
            className="relative w-full max-w-md rounded-xl bg-white shadow-2xl"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{
              type: 'spring',
              damping: 20,
              stiffness: 300,
              duration: 0.3,
            }}
          >
            <div className="relative p-6">
              {/*==================== Modal Header ====================*/}
              <div className="mb-5 flex justify-between items-start">
                <div className="flex items-start">
                  <div
                    className={`mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${content.iconColor}`}
                  >
                    <AlertTriangle className={`h-5 w-5 ${content.iconTextColor}`} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 leading-6">{content.title}</h3>
                </div>

                <button
                  type="button"
                  className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {/*==================== End of Modal Header ====================*/}

              {/*==================== Modal Body ====================*/}
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-4">{content.description}</p>

                <div
                  className={`p-3 ${content.warningBgColor} rounded-lg ${content.warningBorderColor} border`}
                >
                  <p className="text-sm font-medium text-gray-900 flex items-center">
                    <AlertTriangle className={`h-4 w-4 ${content.warningIconColor} mr-2`} />
                    {content.warningText}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {mode === 'permanent'
                      ? 'This action is irreversible'
                      : mode === 'restore'
                        ? isSingleResource
                          ? 'The resource will be available in the main library'
                          : 'These resources will be available in the main library'
                        : isSingleResource
                          ? 'The resource will no longer appear in the main resources list'
                          : 'These resources will no longer appear in the main resources list'}
                  </p>
                </div>
              </div>
              {/*==================== End of Modal Body ====================*/}

              {/*==================== Modal Actions ====================*/}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="inline-flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={`inline-flex justify-center rounded-lg px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 ${content.buttonColor}`}
                >
                  {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                  {content.buttonText}
                </button>
              </div>
              {/*==================== End of Modal Actions ====================*/}
            </div>
          </motion.div>
          {/*==================== End of Modal Content ====================*/}
        </div>
      )}
    </AnimatePresence>
  );
};

export default DeleteResourceModal;
