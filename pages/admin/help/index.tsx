import { NextApiRequest } from 'next';
import {
  Bell,
  Users,
  Upload,
  Shield,
  Trash2,
  Settings,
  FileText,
  Database,
  Calendar,
  BarChart3,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';
import { UserAuth } from '@/types';
import { isLoggedIn } from '@/utils/auth';
import React, { FC, useState } from 'react';
import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import DashboardPageHeader from '@/components/dashboard/layout/dashboard-page-header';

interface FAQItem {
  question: string;
  answer: string;
}

interface IHelpPage {
  userData: UserAuth;
}

const AdminHelpPage: FC<IHelpPage> = ({ userData }) => {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      question: 'How do I upload resources to the system?',
      answer:
        'Navigate to the Resources section, click "Upload Resource", select your files, fill in the required metadata (title, description, department, category), and click upload. Resources can be made visible to students or kept admin-only.',
    },
    {
      question: 'How can I manage user accounts and permissions?',
      answer:
        'Go to the Users section to view all registered users. You can activate/deactivate accounts, view user details, and manage student registrations. Admin permissions allow full access to all system features.',
    },
    {
      question: 'How do I create and manage events?',
      answer:
        'Visit the Events section, click "Create Event", fill in event details including title, description, date, location, and registration requirements. You can edit, delete, and view event registrations from the same section.',
    },
    {
      question: 'How can I track resource usage and analytics?',
      answer:
        'Resource analytics are available for each uploaded file. Click on any resource to view download counts, view statistics, and user engagement metrics. This helps understand which resources are most valuable to students.',
    },
    {
      question: 'What happens to deleted resources?',
      answer:
        'Deleted resources are moved to the Recycle Bin where they can be restored or permanently deleted. This provides a safety net for accidentally deleted materials while keeping the main interface clean.',
    },
    {
      question: 'How do I manage resource categories and visibility?',
      answer:
        'When uploading or editing resources, you can set the category (lecture notes, assignments, etc.), department, academic level, and visibility. Admin-only resources are hidden from students.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <DashboardLayout title="Help & Support" token={userData.token}>
      {/*==================== Page Header ====================*/}
      <DashboardPageHeader
        title="Admin Help &"
        subtitle="Support"
        description="Everything you need to know about managing the ITCA Hub as an administrator"
      />
      {/*==================== End of Page Header ====================*/}

      <div className="space-y-8">
        {/*==================== Quick Start Guide ====================*/}
        <div className="bg-white rounded-2xl px-6 py-10">
          <div className="flex items-center mb-6">
            <Shield className="h-6 w-6 text-blue-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Admin Quick Start Guide</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className=" rounded-lg p-4 hover:border-blue-300 transition-colors">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-500 font-semibold text-md">1</span>
                </div>
                <h3 className="font-medium text-gray-900">Upload Resources</h3>
              </div>
              <p className="text-md text-gray-600 leading-8">
                Upload and organize educational materials for students. Set appropriate categories,
                departments, and visibility levels for each resource.
              </p>
            </div>

            <div className=" rounded-lg p-4 hover:border-blue-300 transition-colors">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-500 font-semibold text-md">2</span>
                </div>
                <h3 className="font-medium text-gray-900">Manage Users</h3>
              </div>
              <p className="text-md text-gray-600 leading-8">
                Oversee student registrations, activate accounts, and manage user permissions to
                ensure proper access control.
              </p>
            </div>

            <div className=" rounded-lg p-4 hover:border-blue-300 transition-colors">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-500 font-semibold text-md">3</span>
                </div>
                <h3 className="font-medium text-gray-900">Monitor Analytics</h3>
              </div>
              <p className="text-md text-gray-600 leading-8">
                Track resource usage, download statistics, and user engagement to optimize the
                learning experience and resource allocation.
              </p>
            </div>
          </div>
        </div>
        {/*==================== End of Quick Start Guide ====================*/}

        {/*==================== Feature Overview ====================*/}
        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center mb-8">
            <Settings className="h-6 w-6 text-blue-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Admin Features</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-8">
              <div className="flex items-start space-x-3">
                <Upload className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Resource Management</h3>
                  <p className="text-md text-gray-600 leading-8">
                    Upload, organize, edit, and delete educational resources. Set visibility levels
                    and organize by department and category for easy student access.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Users className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">User Administration</h3>
                  <p className="text-md text-gray-600 leading-8">
                    Manage student accounts, approve registrations, deactivate users, and monitor
                    user activity across the platform.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Event Management</h3>
                  <p className="text-md text-gray-600 leading-8">
                    Create, edit, and manage campus events. Track registrations and send
                    notifications to students about upcoming activities.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Trash2 className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Recycle Bin</h3>
                  <p className="text-md text-gray-600 leading-8">
                    Safely delete and restore resources through the recycle bin system. Permanently
                    remove or recover accidentally deleted materials.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-start space-x-3">
                <BarChart3 className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Analytics & Reports</h3>
                  <p className="text-md text-gray-600">
                    View detailed analytics on resource usage, download patterns, and user
                    engagement to make data-driven decisions about content.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Database className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Content Organization</h3>
                  <p className="text-md text-gray-600">
                    Organize resources by department, academic level, category, and custom tags to
                    help students find relevant materials quickly.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Bell className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Notification System</h3>
                  <p className="text-md text-gray-600">
                    Send notifications to students about new resources, events, and important
                    announcements through the integrated notification system.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Access Control</h3>
                  <p className="text-md text-gray-600">
                    Manage visibility settings for resources, control who can access what content,
                    and maintain admin-only restricted materials.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*==================== End of Feature Overview ====================*/}

        {/*==================== Management Categories ====================*/}
        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center mb-6">
            <FileText className="h-6 w-6 text-blue-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Management Areas</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Resource Library</h3>
              <p className="text-md text-blue-700">
                Upload and manage lecture notes, assignments, past papers, tutorials, textbooks, and
                research materials.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-green-900 mb-2">User Management</h3>
              <p className="text-md text-green-700">
                Oversee student registrations, account activations, and user permissions across the
                platform.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-purple-900 mb-2">Event Coordination</h3>
              <p className="text-md text-purple-700">
                Create and manage campus events, workshops, and activities with registration
                tracking.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-orange-900 mb-2">Analytics Dashboard</h3>
              <p className="text-md text-orange-700">
                Monitor system usage, resource popularity, and user engagement metrics.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-red-900 mb-2">Content Moderation</h3>
              <p className="text-md text-red-700">
                Review, approve, and moderate user-generated content and ensure quality standards.
              </p>
            </div>

            <div className="bg-gray-100 rounded-lg p-4">
              <h3 className="font-medium text-indigo-900 mb-2">System Administration</h3>
              <p className="text-md text-indigo-700">
                Manage system settings, user roles, and platform configuration options.
              </p>
            </div>
          </div>
        </div>
        {/*==================== End of Management Categories ====================*/}

        {/*==================== How-To Guides ====================*/}
        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center mb-8">
            <GraduationCap className="h-6 w-6 text-blue-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Admin How-To Guides</h2>
          </div>

          <div className="space-y-12">
            <div className="border-l-4 border-t border-b py-6 border-blue-500 pl-4">
              <h3 className="font-medium text-gray-900 mb-4">Uploading Resources</h3>
              <ol className="text-md text-gray-600 space-y-6">
                <li>1. Navigate to "Resources" and click "Upload Resource"</li>
                <li>2. Select files from your computer or drag and drop them</li>
                <li>
                  3. Fill in metadata: title, description, department, category, academic level
                </li>
                <li>4. Set visibility (public for students or admin-only)</li>
                <li>5. Click "Upload" to make resources available</li>
              </ol>
            </div>

            <div className="border-r-4 border-t border-b py-6 border-green-500 pl-4">
              <h3 className="font-medium text-gray-900 mb-4">Managing User Accounts</h3>
              <ol className="text-md text-gray-600 space-y-6">
                <li>1. Go to "Users" section to view all registered users</li>
                <li>2. Click on any user to view their profile and activity</li>
                <li>3. Use "Activate" or "Deactivate" to control account access</li>
                <li>4. Review pending registrations and approve new student accounts</li>
              </ol>
            </div>

            <div className="border-l-4 border-t border-b py-6 border-purple-500 pl-4">
              <h3 className="font-medium text-gray-900 mb-4">Creating Events</h3>
              <ol className="text-md text-gray-600 space-y-6">
                <li>1. Navigate to "Events" and click "Create Event"</li>
                <li>2. Enter event details: title, description, date, time, location</li>
                <li>3. Set registration requirements and capacity limits</li>
                <li>4. Save the event to make it visible to students</li>
              </ol>
            </div>

            <div className="border-r-4 border-t border-b py-6 border-red-500 pl-4">
              <h3 className="font-medium text-gray-900 mb-4">Using the Recycle Bin</h3>
              <ol className="text-md text-gray-600 space-y-6">
                <li>1. Access "Recycle Bin" from the Resources section</li>
                <li>2. View all deleted resources with deletion dates</li>
                <li>3. Click "Restore" to bring back accidentally deleted items</li>
                <li>4. Use "Permanent Delete" to remove items completely</li>
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

export default AdminHelpPage;

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

  if (userAuth.role === 'student') {
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
