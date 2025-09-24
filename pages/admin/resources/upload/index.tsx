import Link from 'next/link';
import { UserAuth } from '@/types';
import { NextApiRequest } from 'next';
import { ArrowLeft } from 'lucide-react';
import { isLoggedIn } from '@/utils/auth';
import { AdminResourceUploadPageProps } from '@/types/interfaces/resource';
import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import ResourceUploader from '@/components/dashboard/shared/resources/resource-uploader';

const AdminResourceUploadPage = ({ userData }: AdminResourceUploadPageProps) => {
  const handleUploadComplete = (_fileData: {
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: string;
  }) => {};

  return (
    <DashboardLayout title="Upload Resource">
      <div className="relative">
        <div className="relative z-10">
          {/*==================== Header Section ====================*/}
          <div className="mb-8">
            <div className="flex items-center">
              <Link
                href="/admin/resources"
                className="mr-3 inline-flex items-center rounded-lg bg-white p-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                  <span className="text-blue-700 mr-2">Upload</span>
                  <span className="text-amber-500">Resources</span>
                  <span className="ml-3 relative">
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                    </span>
                  </span>
                </h1>
                <p className="text-gray-600">
                  Add new educational materials to the resource library
                </p>
              </div>
            </div>
          </div>
          {/*==================== End of Header Section ====================*/}

          {/*==================== Resource Uploader Component ====================*/}
          <ResourceUploader token={userData.token} onUploadComplete={handleUploadComplete} />
          {/*==================== End of Resource Uploader Component ====================*/}

          {/*==================== Guidelines Section ====================*/}
          <div className="mt-6 rounded-xl bg-white/50 p-6">
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
                  <div className="flex-shrink-0 w-5 h-5 mt-0.5  bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <p className="text-gray-700">{guideline}</p>
                </div>
              ))}
            </div>
          </div>
          {/*==================== End of Guidelines Section ====================*/}
        </div>
      </div>
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
    props: {
      userData,
    },
  };
};
