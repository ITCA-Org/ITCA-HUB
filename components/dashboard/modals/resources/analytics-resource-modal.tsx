import { X, Eye, Download, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import useResourceAdmin from '@/hooks/resources/use-resource-admin';
import { ResourceAnalyticsProps, ResourceAnalyticsData } from '@/types/interfaces/modal';

const ResourceAnalytics = ({ token, isOpen = true, resource, onClose }: ResourceAnalyticsProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'views' | 'downloads'>('overview');
  const [analytics, setAnalytics] = useState<ResourceAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { getResourceAnalytics } = useResourceAdmin({ token });

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!resource || !token || !isOpen) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await getResourceAnalytics(resource._id);
        setAnalytics(data);
      } catch {
        setError('Unable to load detailed analytics. Showing basic stats.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, [resource, token, getResourceAnalytics, isOpen]);

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-3xl w-full relative">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-3xl w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-center text-gray-500">Failed to load analytics data</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const views = analytics.views || 0;
  const downloads = analytics.downloads || 0;
  const engagement = Math.round((downloads / Math.max(views, 1)) * 100);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-3xl w-full relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        <X className="w-5 h-5" />
      </button>

      <h2 className="text-xl font-bold mb-6 text-gray-900 pr-8">{resource.title} - Analytics</h2>

      {error && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">{error}</p>
        </div>
      )}

      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'overview'
              ? 'text-blue-500 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'views'
              ? 'text-blue-500 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('views')}
        >
          Views
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'downloads'
              ? 'text-blue-500 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('downloads')}
        >
          Downloads
        </button>
      </div>

      {activeTab === 'overview' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 flex items-center">
              <div className="bg-blue-100 rounded-full p-3 mr-3">
                <Eye className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{views}</p>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4 flex items-center">
              <div className="bg-green-100 rounded-full p-3 mr-3">
                <Download className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Downloads</p>
                <p className="text-2xl font-bold text-gray-900">{downloads}</p>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 flex items-center">
              <div className="bg-purple-100 rounded-full p-3 mr-3">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Unique Viewers</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.uniqueViewers || 0}</p>
              </div>
            </div>

            <div className="bg-amber-50 rounded-lg p-4 flex items-center">
              <div className="bg-amber-100 rounded-full p-3 mr-3">
                <Users className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Unique Downloaders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.uniqueDownloaders || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-medium mb-3 text-gray-900">Engagement Rate</h3>
            <div className="bg-gray-100 h-6 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full flex items-center justify-center text-xs text-white font-medium"
                style={{ width: `${Math.min(100, engagement)}%` }}
              >
                {engagement}%
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">Download to view ratio (engagement rate)</p>
          </div>
        </div>
      )}

      {activeTab === 'views' && (
        <div>
          <h3 className="text-lg font-medium mb-4 text-gray-900">Daily Views</h3>
          {analytics.viewsByDay && analytics.viewsByDay.length > 0 ? (
            <div className="bg-blue-50 p-4 rounded-lg h-64 flex items-end space-x-2">
              {analytics.viewsByDay.map((day, index) => {
                const maxCount = Math.max(...analytics.viewsByDay.map((d) => d.count));
                const height = maxCount > 0 ? (day.count / maxCount) * 200 : 0;
                return (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div
                      className="bg-blue-600 w-full rounded-t-sm min-h-[2px]"
                      style={{ height: `${Math.max(height, 2)}px` }}
                      title={`${day.count} views on ${day.date}`}
                    ></div>
                    <p className="text-xs text-gray-500 mt-1">{day.date.split('-')[2]}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-blue-50 p-4 rounded-lg h-64 flex items-center justify-center">
              <p className="text-gray-500">No daily view data available</p>
            </div>
          )}
          <p className="text-sm text-gray-500 mt-3 text-center">
            {analytics.viewsByDay && analytics.viewsByDay.length > 0
              ? 'Last 7 days of views'
              : 'View tracking data will appear here once available'}
          </p>
        </div>
      )}

      {activeTab === 'downloads' && (
        <div>
          <h3 className="text-lg font-medium mb-4 text-gray-900">Daily Downloads</h3>
          {analytics.downloadsByDay && analytics.downloadsByDay.length > 0 ? (
            <div className="bg-green-50 p-4 rounded-lg h-64 flex items-end space-x-2">
              {analytics.downloadsByDay.map((day, index) => {
                const maxCount = Math.max(...analytics.downloadsByDay.map((d) => d.count));
                const height = maxCount > 0 ? (day.count / maxCount) * 200 : 0;
                return (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div
                      className="bg-green-600 w-full rounded-t-sm min-h-[2px]"
                      style={{ height: `${Math.max(height, 2)}px` }}
                      title={`${day.count} downloads on ${day.date}`}
                    ></div>
                    <p className="text-xs text-gray-500 mt-1">{day.date.split('-')[2]}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-green-50 p-4 rounded-lg h-64 flex items-center justify-center">
              <p className="text-gray-500">No daily download data available</p>
            </div>
          )}
          <p className="text-sm text-gray-500 mt-3 text-center">
            {analytics.downloadsByDay && analytics.downloadsByDay.length > 0
              ? 'Last 7 days of downloads'
              : 'Download tracking data will appear here once available'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ResourceAnalytics;
