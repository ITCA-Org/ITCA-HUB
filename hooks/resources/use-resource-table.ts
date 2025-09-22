import { toast } from 'sonner';
import { BASE_URL } from '@/utils/url';
import { useRouter } from 'next/router';
import axios, { AxiosError } from 'axios';
import { getErrorMessage } from '@/utils/error';
import { CustomError, ErrorResponseData } from '@/types';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { Resource, UseResourceTableProps } from '@/types/interfaces/resource';

const useResourceTable = ({
  resources,
  token,
  userRole,
  onRefresh,
  onDeleteResource,
  onDeleteMultiple,
  onRestoreResource,
  onRestoreMultiple,
}: UseResourceTableProps) => {
  const router = useRouter();

  const [selectedResources, setSelectedResources] = useState<Record<string, boolean>>({});
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const selectedCount = useMemo(
    () => Object.values(selectedResources).filter(Boolean).length,
    [selectedResources]
  );

  const hasMultipleSelected = useMemo(() => selectedCount > 1, [selectedCount]);

  const selectedResourceIds = useMemo(
    () =>
      Object.entries(selectedResources)
        .filter(([, isSelected]) => isSelected)
        .map(([id]) => id),
    [selectedResources]
  );

  const clearSelection = useCallback(() => {
    setSelectedResources({});
  }, []);

  useEffect(() => {
    clearSelection();
  }, [clearSelection]);

  /**=======================================
   * Handle single row selection
   =======================================*/
  const toggleSelection = useCallback((resource: Resource, event: React.MouseEvent) => {
    const isMultiSelectKey = event.ctrlKey || event.metaKey;

    setSelectedResources((prev) => {
      const newSelection = { ...prev };

      if (!isMultiSelectKey) {
        if (prev[resource._id] && Object.values(prev).filter(Boolean).length === 1) {
          newSelection[resource._id] = false;
          return newSelection;
        }

        Object.keys(newSelection).forEach((id) => {
          newSelection[id] = false;
        });
      }

      newSelection[resource._id] = !prev[resource._id];
      return newSelection;
    });
  }, []);

  /**=======================================
   * Select all resources on current page
   =======================================*/
  const selectAll = useCallback(() => {
    const newSelection = { ...selectedResources };
    const allSelected = resources.every((item) => selectedResources[item._id]);

    resources.forEach((item) => {
      newSelection[item._id] = !allSelected;
    });

    setSelectedResources(newSelection);
  }, [resources, selectedResources]);

  const handleDoubleClick = useCallback(
    (resource: Resource) => {
      clearSelection();
      const viewPath =
        userRole === 'admin'
          ? `/admin/resources/${resource._id}`
          : `/student/resources/${resource._id}`;
      router.push(viewPath);
    },
    [router, clearSelection, userRole]
  );

  const handleViewAnalytics = (resource: Resource, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedResource(resource);
    setShowAnalytics(true);
  };

  const handleEditResource = (resource: Resource, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedResource(resource);
    setShowEditModal(true);
  };

  const handleDeleteResource = async (resource: Resource, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedResource(resource);
    setShowDeleteModal(true);
  };

  const handleDeleteSelected = () => {
    if (selectedCount > 0) {
      setShowDeleteModal(true);
    }
  };

  const confirmDelete = async () => {
    setIsDeleting(true);

    try {
      let success = false;

      if (selectedResource && !hasMultipleSelected) {
        if (onDeleteResource) {
          success = await onDeleteResource(selectedResource._id);
        }
      } else if (hasMultipleSelected) {
        if (onDeleteMultiple) {
          success = await onDeleteMultiple(selectedResourceIds);
        }
      }

      if (success) {
        clearSelection();
        setShowDeleteModal(false);
        setSelectedResource(null);
        onRefresh();
      }
    } catch (error) {
      const { message } = getErrorMessage(
        error as AxiosError<ErrorResponseData> | CustomError | Error
      );
      toast.error('Failed to delete resource(s)', {
        description: message,
        duration: 5000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmRestore = async () => {
    setIsDeleting(true);

    try {
      let success = false;

      if (selectedResource && !hasMultipleSelected) {
        if (onRestoreResource) {
          success = await onRestoreResource(selectedResource._id);
        }
      } else if (hasMultipleSelected) {
        if (onRestoreMultiple) {
          success = await onRestoreMultiple(selectedResourceIds);
        }
      }

      if (success) {
        clearSelection();
        setShowDeleteModal(false);
        setSelectedResource(null);
        onRefresh();
      }
    } catch (error) {
      const { message } = getErrorMessage(
        error as AxiosError<ErrorResponseData> | CustomError | Error
      );
      toast.error('Failed to restore resource(s)', {
        description: message,
        duration: 5000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  /**=========================================
   * Save resource changes using direct API call
   =========================================*/
  const handleSaveResource = async (updatedResource: Partial<Resource>) => {
    setIsEditing(true);
    try {
      if (!selectedResource) {
        throw new Error('No resource selected');
      }

      const response = await axios.patch(
        `${BASE_URL}/resources/${selectedResource._id}`,
        updatedResource,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.status === 'success') {
        toast.success('Resource updated successfully');
        setShowEditModal(false);
        setSelectedResource(null);
        onRefresh();
      } else {
        throw new Error(response.data.message || 'Failed to update resource');
      }
    } catch (error) {
      const { message } = getErrorMessage(
        error as AxiosError<ErrorResponseData> | CustomError | Error
      );
      toast.error('Failed to update resource', {
        description: message,
        duration: 5000,
      });
      throw error;
    } finally {
      setIsEditing(false);
    }
  };

  return {
    isEditing,
    selectAll,
    isDeleting,
    showAnalytics,
    showEditModal,
    confirmDelete,
    selectedCount,
    confirmRestore,
    clearSelection,
    toggleSelection,
    showDeleteModal,
    setShowAnalytics,
    selectedResource,
    setShowEditModal,
    selectedResources,
    handleDoubleClick,
    setShowDeleteModal,
    handleEditResource,
    handleSaveResource,
    hasMultipleSelected,
    setSelectedResource,
    selectedResourceIds,
    handleViewAnalytics,
    handleDeleteResource,
    handleDeleteSelected,
  };
};

export default useResourceTable;
