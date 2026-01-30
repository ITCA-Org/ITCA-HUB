import { UserAuth } from '@/types';
import { NextApiRequest } from 'next';
import { useRouter } from 'next/router';
import { isLoggedIn } from '@/utils/auth';
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import ConfirmationModal from '@/components/dashboard/modals/confirmation-modal';
import DashboardPageHeader from '@/components/dashboard/layout/dashboard-page-header';
import ResourceUploader from '@/components/dashboard/shared/resources/resource-uploader';

interface AdminResourceUploadPageProps {
  userData: UserAuth;
}

const AdminResourceUploadPage = ({ userData }: AdminResourceUploadPageProps) => {
  const router = useRouter();
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [isUploadInProgress, setIsUploadInProgress] = useState(false);
  const pendingNavigationRef = useRef<(() => void) | null>(null);

  const handleUploadComplete = (_fileData: {
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: string;
  }) => {
    setIsUploadInProgress(false);
  };

  const handleUploadError = () => {
    setIsUploadInProgress(false);
  };

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (isUploadInProgress) {
        pendingNavigationRef.current = () => router.push(url);
        setShowExitConfirmation(true);
        throw 'routeChange aborted';
      }
    };

    const handleBackButton = () => {
      if (isUploadInProgress) {
        pendingNavigationRef.current = () => router.back();
        setShowExitConfirmation(true);
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isUploadInProgress) {
        e.preventDefault();
        e.returnValue = 'Upload in progress. Are you sure you want to leave?';
        return 'Upload in progress. Are you sure you want to leave?';
      }
    };

    router.events.on('routeChangeStart', handleRouteChange);

    router.beforePopState((_) => {
      if (isUploadInProgress) {
        handleBackButton();
        return false;
      }
      return true;
    });

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isUploadInProgress, router]);

  const handleConfirmExit = () => {
    setIsUploadInProgress(false);
    setShowExitConfirmation(false);
    if (pendingNavigationRef.current) {
      pendingNavigationRef.current();
      pendingNavigationRef.current = null;
    }
  };

  const handleCancelExit = () => {
    setShowExitConfirmation(false);
    pendingNavigationRef.current = null;
  };

  return (
    <DashboardLayout title="Upload Resource">
      <DashboardPageHeader
        title="Upload"
        subtitle="Resource"
        description="Add new educational materials to the resource library"
        leftActions={
          <button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 cursor-pointer" />
          </button>
        }
      />

      <div className="relative">
        <div className="relative z-10">
          <div
            onClick={(e) => {
              const target = e.target as HTMLElement;
              const buttonElement = target as HTMLButtonElement;
              if (buttonElement.type === 'submit' || target.closest('button[type="submit"]')) {
                setTimeout(() => {
                  setIsUploadInProgress(true);
                }, 100);
              }
            }}
          >
            <ResourceUploader
              token={userData.token}
              onError={handleUploadError}
              onUploadComplete={handleUploadComplete}
            />
          </div>

          <div className="mt-6 rounded-xl bg-white/70 p-6">
            <h1 className="text-2xl font-bold flex items-center">
              <span className="text-blue-700 mr-2">Upload</span>
              <span className="text-amber-500">Guidelines</span>
              <span className="ml-3 relative">
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </span>
              </span>
            </h1>

            <div className="rounded-lg sm:p-1 lg:p-4">
              {[
                'All uploaded resources should be relevant to educational purposes.',
                'Upload up to 50 files per resource with a maximum of 100MB per file.',
                'Organize related files together - lectures with assignments, theory with practice examples.',
                'Supported file types include PDFs, documents, spreadsheets, presentations, images, videos, and more.',
                'Ensure you have the necessary rights or permissions to share all uploaded content.',
                'Choose a descriptive title and appropriate category to make resources easy to find.',
                'Add a clear description explaining what the resource collection contains.',
              ].map((guideline, index) => (
                <div
                  key={index}
                  className="even:bg-gray-100 flex items-start gap-3 rounded-lg px-2 py-4"
                >
                  <div className="shrink-0 w-5 h-5 mt-0.5  bg-blue-100 text-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <p className="text-gray-700">{guideline}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        variant="warning"
        title="Upload in Progress"
        onClose={handleCancelExit}
        confirmText="Leave Anyway"
        isOpen={showExitConfirmation}
        onConfirm={handleConfirmExit}
        cancelText="Stay and Continue"
        icon={<AlertTriangle className="h-5 w-5" />}
        message="You have an active upload in progress. If you leave now, your upload will be canceled and you'll lose all progress. You'll need to start over from the beginning."
      />
    </DashboardLayout>
  );
};

export default AdminResourceUploadPage;

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  const userData = isLoggedIn(req);

  if (userData === false) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      },
    };
  }

  const userAuth = userData as UserAuth;

  if (userAuth.role === 'user') {
    return {
      redirect: {
        destination: '/student',
        permanent: false,
      },
    };
  }

  return {
    props: { userData },
  };
};
