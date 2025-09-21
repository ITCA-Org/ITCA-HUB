import Link from 'next/link';
import { useState, useEffect, useCallback, useMemo } from 'react';
import useResources from '@/hooks/resources/use-resource';
import useResourceAdmin from '@/hooks/resources/use-resource-admin';
import { ResourcesComponentProps } from '@/types/interfaces/resource';
import ResourceTable from '@/components/dashboard/table/resource-table';
import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import { Upload, Filter, Building2, Tag, Eye, Search, GraduationCap } from 'lucide-react';
import DashboardPageHeader from '@/components/dashboard/layout/dashboard-page-header';
import ResourceTableSkeleton from '@/components/dashboard/skeletons/resource-table-skeleton';
import ResourceFilterSkeleton from '@/components/dashboard/skeletons/resource-filter-skeleton';

const ResourcesComponent = ({ role, userData }: ResourcesComponentProps) => {
  const { isError, resources, isLoading, pagination, searchTerm, setSearchTerm, fetchResources } =
    useResources({
      token: userData.token,
    });

  const adminHook = useResourceAdmin({ token: userData.token });

  const [department, setDepartment] = useState<
    'all' | 'computer_science' | 'information_systems' | 'telecommunications'
  >('all');
  const [category, setCategory] = useState('all');
  const [visibility, setVisibility] = useState<'all' | 'admin'>('all');
  const [academicLevel, setAcademicLevel] = useState<'all' | 'undergraduate' | 'postgraduate'>(
    'all'
  );

  const { currentPage, limit } = pagination;

  const filterParams = useMemo(
    () => ({
      ...(department !== 'all' && { department }),
      ...(category !== 'all' && { category }),
      ...(academicLevel !== 'all' && { academicLevel }),
      visibility: role === 'student' ? 'all' : visibility,
    }),
    [department, category, academicLevel, visibility, role]
  );

  const filteredResources = useMemo(() => {
    if (role === 'student') {
      return resources.filter((resource) => resource.visibility === 'all');
    }
    return resources;
  }, [resources, role]);

  const handleDeleteResource = useCallback(
    async (resourceId: string): Promise<boolean> => {
      if (role !== 'admin' || !adminHook?.toggleResourceTrash) return false;

      try {
        await adminHook.deleteResourcePermanently(resourceId);
        return true;
      } catch {
        return false;
      }
    },
    [adminHook, role]
  );

  const loadResources = useCallback(() => {
    fetchResources({
      page: currentPage,
      limit,
      ...filterParams,
    });
  }, [fetchResources, currentPage, limit, filterParams]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      fetchResources({
        page: newPage,
        limit,
        ...filterParams,
      });
    },
    [fetchResources, limit, filterParams]
  );

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setDepartment('all');
    setCategory('all');
    setVisibility('all');
    setAcademicLevel('all');
  }, [setSearchTerm]);

  useEffect(() => {
    fetchResources({
      page: 0,
      limit,
      ...filterParams,
    });
  }, [filterParams, fetchResources, limit]);

  const pageConfig = {
    admin: {
      title: 'Resource',
      subtitle: 'Management',
      description: 'Upload, manage, and organize educational materials',
      dashboardTitle: 'Resource Management',
      actions: (
        <div className="flex flex-col gap-4 w-full md:flex-row sm:mt-0 space-x-3">
          <Link
            href="/admin/resources/upload"
            className="group inline-flex items-center rounded-lg bg-gradient-to-r from-blue-700 to-blue-600 px-4 py-2 text-sm font-medium text-white hover:from-blue-800 hover:to-blue-700 focus:outline-none focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <Upload className="mr-2 h-4 w-4 transition-transform group-hover:translate-y-[-2px]" />
            Upload Resource
          </Link>
        </div>
      ),
    },
    student: {
      title: 'Resource',
      subtitle: 'Library',
      description: 'Explore and access educational materials for your studies',
      dashboardTitle: 'Resource Library',
      actions: <div className="flex flex-col gap-4 w-full md:flex-row sm:mt-0 space-x-3"></div>,
    },
  };

  const config = pageConfig[role];

  return (
    <DashboardLayout title={config.dashboardTitle} token={userData.token}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <DashboardPageHeader
          title={config.title}
          subtitle={config.subtitle}
          description={config.description}
          actions={config.actions}
        />
      </div>

      {isLoading ? (
        <>
          <ResourceFilterSkeleton role={role} />
          <ResourceTableSkeleton />
        </>
      ) : (
        <>
          <div className="mb-6 bg-white rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="mr-2 bg-green-100/70 p-2 rounded-full">
                  <Filter className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Filter Resources</h3>
              </div>
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-blue-600 cursor-pointer transition-colors"
              >
                Clear Filters
              </button>
            </div>

            <div className="mb-4 pt-2">
              <label className="block text-sm font-medium text-gray-500 mb-1">Search</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search resources by title or description..."
                  className="w-full rounded-lg bg-gray-100/70 pl-10 pr-4 py-2.5 text-sm text-gray-500 focus:bg-slate-200/50 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div
              className={`grid grid-cols-1 ${role === 'admin' ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-4 pt-2`}
            >
              <div>
                <label className="flex items-center text-sm text-gray-700 mb-2">
                  <div className="bg-blue-100/70 p-2 rounded-full mr-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value as typeof department)}
                  className="w-full rounded-lg bg-gray-100/70 py-2.5 pl-3 pr-8 text-sm text-gray-500 focus:bg-slate-100 focus:outline-none transition-colors"
                >
                  <option value="all">All Departments</option>
                  <option value="computer_science">Computer Science</option>
                  <option value="information_systems">Information Systems</option>
                  <option value="telecommunications">Telecommunications</option>
                </select>
              </div>

              <div>
                <label className="flex items-center text-sm text-gray-700 mb-2">
                  <div className="bg-purple-100/70 p-2 rounded-full mr-2">
                    <Tag className="h-5 w-5 text-purple-600" />
                  </div>
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg bg-gray-100/70 py-2.5 pl-3 pr-8 text-sm text-gray-500 focus:bg-slate-100 focus:outline-none transition-colors"
                >
                  <option value="all">All Categories</option>
                  <option value="lecture_note">Lecture Notes</option>
                  <option value="assignment">Assignments</option>
                  <option value="past_papers">Past Papers</option>
                  <option value="tutorial">Tutorials</option>
                  <option value="textbook">Textbooks</option>
                  <option value="research_papers">Research Papers</option>
                </select>
              </div>

              <div>
                <label className="flex items-center text-sm text-gray-700 mb-2">
                  <div className="bg-green-100/70 p-2 rounded-full mr-2">
                    <GraduationCap className="h-5 w-5 text-green-600" />
                  </div>
                  Academic Level
                </label>
                <select
                  value={academicLevel}
                  onChange={(e) => setAcademicLevel(e.target.value as typeof academicLevel)}
                  className="w-full rounded-lg bg-gray-100/70 py-2.5 pl-3 pr-8 text-sm text-gray-500 focus:bg-slate-100 focus:outline-none transition-colors"
                >
                  <option value="all">All Levels</option>
                  <option value="undergraduate">Undergraduate</option>
                  <option value="postgraduate">Postgraduate</option>
                </select>
              </div>

              {role === 'admin' && (
                <div>
                  <label className="flex items-center text-sm text-gray-700 mb-2">
                    <div className="bg-orange-100/70 p-2 rounded-full mr-2">
                      <Eye className="h-5 w-5 text-orange-600" />
                    </div>
                    Visibility
                  </label>
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value as 'all' | 'admin')}
                    className="w-full rounded-lg bg-gray-100/70 py-2.5 pl-3 pr-8 text-sm text-gray-500 focus:bg-slate-100 focus:outline-none transition-colors"
                  >
                    <option value="all">All Resources</option>
                    <option value="admin">Admin Only</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          <ResourceTable
            isError={isError}
            isLoading={false}
            token={userData.token}
            searchTerm={searchTerm}
            total={pagination.total}
            limit={pagination.limit}
            allResources={resources}
            onRefresh={loadResources}
            setPage={handlePageChange}
            resources={filteredResources}
            page={pagination.currentPage}
            onClearFilters={clearFilters}
            totalPages={pagination.totalPages}
            userRole={role === 'admin' ? 'admin' : 'user'}
            onDeleteResource={role === 'admin' ? handleDeleteResource : undefined}
          />
        </>
      )}
    </DashboardLayout>
  );
};

export default ResourcesComponent;
