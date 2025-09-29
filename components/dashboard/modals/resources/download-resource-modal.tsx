import { X, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DownloadResourceModalProps } from '@/types/interfaces/modal';

const DownloadResourceModal = ({
  isOpen,
  resource,
  onClose,
  onConfirm,
  isDownloading,
  downloadProgress,
}: DownloadResourceModalProps) => {
  if (!resource) return null;

  const isMultipleFiles = resource.fileUrls.length > 1;
  const fileCount = resource.fileUrls.length;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/*==================== Background Overlay ====================*/}
          <motion.div
            onClick={!isDownloading ? onClose : undefined}
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
            {/*==================== Confirmation Phase ====================*/}
            {!isDownloading && (
              <div className="relative p-6">
                {/*==================== Modal Header ====================*/}
                <div className="mb-5 flex justify-between items-start">
                  <div className="flex items-start">
                    <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                      <Download className="h-5 w-5 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 leading-6">
                      Download Resource
                    </h3>
                  </div>

                  <button
                    type="button"
                    className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    onClick={onClose}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                {/*==================== End of Modal Header ====================*/}

                {/*==================== Modal Body ====================*/}
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-4">
                    Are you sure you want to download "{resource.title}"?
                  </p>

                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-sm font-medium text-gray-900 flex items-center">
                      <Download className="h-4 w-4 text-blue-500 mr-2" />
                      {isMultipleFiles
                        ? `${fileCount} files will be downloaded and packaged into a ZIP file`
                        : 'File will be downloaded directly'}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {isMultipleFiles
                        ? 'This may take a few moments depending on file sizes'
                        : 'Download will start immediately'}
                    </p>
                  </div>
                </div>
                {/*==================== End of Modal Body ====================*/}

                {/*==================== Modal Actions ====================*/}
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg"
                    onClick={onConfirm}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </button>
                </div>
                {/*==================== End of Modal Actions ====================*/}
              </div>
            )}
            {/*==================== End of Confirmation Phase ====================*/}

            {/*==================== Progress Phase ====================*/}
            {isDownloading && isMultipleFiles && (
              <div className="relative p-8">
                {/*==================== Progress Header ====================*/}
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Downloading Resource</h3>
                  <p className="text-sm text-gray-600">Preparing your download...</p>
                </div>
                {/*==================== End of Progress Header ====================*/}

                {/*==================== Circular Progress Indicator ====================*/}
                <div className="flex items-center justify-center mb-6">
                  <div className="relative">
                    {/*==================== Background Circle ====================*/}
                    <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                      <circle
                        cx="40"
                        cy="40"
                        r="32"
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="none"
                        className="text-gray-200"
                      />
                      {/*==================== Progress Circle ====================*/}
                      <circle
                        cx="40"
                        cy="40"
                        r="32"
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 32}`}
                        strokeDashoffset={`${2 * Math.PI * 32 * (1 - downloadProgress / 100)}`}
                        className="text-blue-500 transition-all duration-300 ease-out"
                        strokeLinecap="round"
                      />
                    </svg>
                    {/*==================== Progress Percentage ====================*/}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-semibold text-gray-900">
                        {Math.round(downloadProgress)}%
                      </span>
                    </div>
                  </div>
                </div>
                {/*==================== End of Circular Progress Indicator ====================*/}

                {/*==================== Progress Info ====================*/}
                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Please wait while we prepare your files...
                  </p>
                </div>
                {/*==================== End of Progress Info ====================*/}
              </div>
            )}
            {/*==================== End of Progress Phase ====================*/}
          </motion.div>
          {/*==================== End of Modal Content ====================*/}
        </div>
      )}
    </AnimatePresence>
  );
};

export default DownloadResourceModal;
