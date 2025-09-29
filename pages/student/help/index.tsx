import React, { FC, useState } from 'react';
import { NextApiRequest } from 'next';
import {
  Search,
  Download,
  BookOpen,
  Bell,
  User,
  Star,
  Bookmark,
  FileText,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  Settings,
  Eye,
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import DashboardPageHeader from '@/components/dashboard/layout/dashboard-page-header';
import { UserAuth } from '@/types';
import { isLoggedIn } from '@/utils/auth';

interface FAQItem {
  question: string;
  answer: string;
}

interface IHelpPage {
  userData: UserAuth;
}

const StudentHelpPage: FC<IHelpPage> = ({ userData }) => {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      question: 'How do I download resources?',
      answer:
        'Navigate to the Resources section, find the resource you need, and click the download button. The system will track your download for analytics purposes.',
    },
    {
      question: "Why can't I access certain resources?",
      answer:
        'Some resources are restricted by department, academic level, or visibility settings. Contact your admin if you believe you should have access to specific resources.',
    },
    {
      question: 'How do I enable notifications?',
      answer:
        "Go to your browser settings and allow notifications for this site. You'll automatically receive alerts when new resources relevant to your studies are added.",
    },
    {
      question: 'Can I bookmark resources for later?',
      answer:
        'Yes! Use the bookmark feature to save frequently accessed materials. Your bookmarks are saved to your profile for easy access.',
    },
    {
      question: 'How do I update my profile information?',
      answer:
        "Visit the Profile section, click 'Edit Profile', update your information, and save changes. You can also upload a profile picture.",
    },
    {
      question: 'What file types are supported?',
      answer:
        'The system supports various file types including PDFs, documents (DOC, DOCX), presentations (PPT, PPTX), images, and archive files (ZIP, RAR).',
    },
  ];

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <DashboardLayout title="Help & Support" token={userData.token}>
      {/*==================== Page Header ====================*/}
      <DashboardPageHeader
        title="Help &"
        subtitle="Support"
        description="Everything you need to know about using the ITCA Hub as a student"
      />
      {/*==================== End of Page Header ====================*/}

      <div className="space-y-8">
        {/*==================== Quick Start Guide ====================*/}
        <div className="bg-white rounded-2xl px-6 py-10">
          <div className="flex items-center mb-6">
            <GraduationCap className="h-6 w-6 text-blue-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Quick Start Guide</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className=" rounded-lg p-4 hover:border-blue-300 transition-colors">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-500 font-semibold text-md">1</span>
                </div>
                <h3 className="font-medium text-gray-900">Explore Resources</h3>
              </div>
              <p className="text-md text-gray-600 leading-8">
                Browse through lecture notes, assignments, tutorials, and research papers organized
                by department and subject.
              </p>
            </div>

            <div className=" rounded-lg p-4 hover:border-blue-300 transition-colors">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-500 font-semibold text-md">2</span>
                </div>
                <h3 className="font-medium text-gray-900">Search & Filter</h3>
              </div>
              <p className="text-md text-gray-600 leading-8">
                Use the powerful search and filtering tools to quickly find specific resources by
                type, department, or academic level.
              </p>
            </div>

            <div className=" rounded-lg p-4 hover:border-blue-300 transition-colors">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-500 font-semibold text-md">3</span>
                </div>
                <h3 className="font-medium text-gray-900">Stay Updated</h3>
              </div>
              <p className="text-md text-gray-600 leading-8">
                Enable notifications to get alerts when new resources are added or when there are
                updates to your bookmarked materials.
              </p>
            </div>
          </div>
        </div>
        {/*==================== End of Quick Start Guide ====================*/}

        {/*==================== Feature Overview ====================*/}
        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center mb-8">
            <BookOpen className="h-6 w-6 text-blue-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Key Features</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-8">
              <div className="flex items-start space-x-3">
                <Search className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Advanced Search</h3>
                  <p className="text-md text-gray-600 leading-8">
                    Search resources by keywords, filter by department, academic level, file type,
                    and category to find exactly what you need.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Download className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Easy Downloads</h3>
                  <p className="text-md text-gray-600 leading-8">
                    Download lecture notes, assignments, and study materials with a single click.
                    All downloads are tracked for your reference.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Bookmark className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Bookmarks</h3>
                  <p className="text-md text-gray-600 leading-8">
                    Save frequently used resources to your bookmarks for quick access anytime.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Star className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Rate & Review</h3>
                  <p className="text-md text-gray-600 leading-8">
                    Rate resources and leave feedback to help other students and improve the quality
                    of materials.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-start space-x-3">
                <Bell className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Push Notifications</h3>
                  <p className="text-md text-gray-600">
                    Get instant notifications when new resources are added or when there are updates
                    to existing materials.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <User className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Profile Management</h3>
                  <p className="text-md text-gray-600">
                    Manage your profile information, update your details, and upload a profile
                    picture.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Eye className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Resource Preview</h3>
                  <p className="text-md text-gray-600">
                    Preview documents before downloading to ensure they contain the information you
                    need.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*==================== End of Feature Overview ====================*/}

        {/*==================== Resource Categories ====================*/}
        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center mb-6">
            <FileText className="h-6 w-6 text-blue-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Resource Categories</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Lecture Notes</h3>
              <p className="text-md text-blue-700">
                Comprehensive notes from lectures covering course materials and key concepts.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-green-900 mb-2">Assignments</h3>
              <p className="text-md text-green-700">
                Course assignments, homework tasks, and practical exercises.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-purple-900 mb-2">Past Papers</h3>
              <p className="text-md text-purple-700">
                Previous examination papers and quiz materials for exam preparation.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-orange-900 mb-2">Tutorials</h3>
              <p className="text-md text-orange-700">
                Step-by-step guides and tutorial materials for hands-on learning.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-red-900 mb-2">Textbooks</h3>
              <p className="text-md text-red-700">
                Digital textbooks and reference materials for comprehensive study.
              </p>
            </div>

            <div className="bg-gray-100 rounded-lg p-4">
              <h3 className="font-medium text-indigo-900 mb-2">Research Papers</h3>
              <p className="text-md text-indigo-700">
                Academic research papers and scholarly articles relevant to your studies.
              </p>
            </div>
          </div>
        </div>
        {/*==================== End of Resource Categories ====================*/}

        {/*==================== How-To Guides ====================*/}
        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center mb-8">
            <Settings className="h-6 w-6 text-blue-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">How-To Guides</h2>
          </div>

          <div className="space-y-12">
            <div className="border-l-4  border-t border-b py-6 border-blue-500 pl-4">
              <h3 className="font-medium text-gray-900 mb-4">Finding Resources</h3>
              <ol className="text-md text-gray-600 space-y-6">
                <li>1. Navigate to the "Resources" section from the sidebar</li>
                <li>2. Use the search bar to enter keywords or browse by category</li>
                <li>3. Apply filters for department, academic level, or file type</li>
                <li>4. Click on any resource to view details and download options</li>
              </ol>
            </div>

            <div className="border-r-4 border-t border-b py-6 border-green-500 pl-4">
              <h3 className="font-medium text-gray-900 mb-4">Managing Your Profile</h3>
              <ol className="text-md text-gray-600 space-y-6">
                <li>1. Go to "Profile" section from the sidebar</li>
                <li>2. Click "Edit Profile" to update your information</li>
                <li>3. Upload a profile picture by clicking the camera icon</li>
                <li>4. Save your changes to update your profile</li>
              </ol>
            </div>

            <div className="border-l-4  border-t border-b py-6 border-purple-500 pl-4">
              <h3 className="font-medium text-gray-900 mb-4">Enabling Notifications</h3>
              <ol className="text-md text-gray-600 space-y-6">
                <li>1. Allow notifications when prompted by your browser</li>
                <li>2. Notifications will automatically appear for new resources</li>
                <li>3. You can manage notification settings in your browser preferences</li>
              </ol>
            </div>
          </div>
        </div>
        {/*==================== End of How-To Guides ====================*/}

        {/*==================== FAQ Section ====================*/}
        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center mb-6">
            <HelpCircle className="h-6 w-6 text-blue-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div key={index} className="border-b border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900">{item.question}</span>
                  {expandedFAQ === index ? (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {expandedFAQ === index && (
                  <div className="px-4 pb-4">
                    <p className="text-md text-gray-600">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        {/*==================== End of FAQ Section ====================*/}
      </div>
    </DashboardLayout>
  );
};

export default StudentHelpPage;

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

  if (userAuth.role === 'admin') {
    return {
      redirect: {
        destination: '/admin',
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
