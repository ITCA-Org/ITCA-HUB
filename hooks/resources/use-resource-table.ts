import { toast } from 'sonner';
import { useRouter } from 'next/router';
import { AxiosError } from 'axios';
import { getErrorMessage } from '@/utils/error';
import { CustomError, ErrorResponseData } from '@/types';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { Resource, UseResourceTableProps, UpdateResourcePayload } from '@/types/interfaces/resource';
import useResourceAdmin from './use-resource-admin';

const useResourceTable = ({
  resources,
  token,
  userRole,
  onRefresh,
  onDeleteResource,
  onDeleteMultiple,
  onRestoreResource,
  onRestoreMultiple,
  onCacheInvalidate,
  mode = 'default',
}: UseResourceTableProps & { onCacheInvalidate?: () => void }) => {
  const router = useRouter();
  const adminHook = useResourceAdmin({ token });

  const [selectedResources, setSelectedResources] = useState<Record<string, boolean>>({});
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

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
          const deleteMode = mode === 'recycleBin' ? 'permanent' : 'soft';
          success = await onDeleteResource(selectedResource._id, deleteMode);
        }
      } else if (hasMultipleSelected) {
        if (onDeleteMultiple) {
          const deleteMode = mode === 'recycleBin' ? 'permanent' : 'soft';
          success = await onDeleteMultiple(selectedResourceIds, deleteMode);
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

  const handleRestoreSelected = () => {
    if (selectedCount > 0) {
      setShowRestoreModal(true);
    }
  };

  const handleRestoreResource = (resource: Resource, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedResource(resource);
    setShowRestoreModal(true);
  };

  const confirmRestore = async () => {
    setIsRestoring(true);

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
        setShowRestoreModal(false);
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
      setIsRestoring(false);
    }
  };

  /**=============================================
   * Save resource changes using adminHook
   =============================================*/
  const handleSaveResource = async (updatedResource: Partial<Resource>) => {
    if (!selectedResource) return;

    try {
      const resourceId = selectedResource._id || selectedResource.resourceId;
      if (!resourceId) {
        throw new Error('Resource ID not found');
      }

      const payload: UpdateResourcePayload = {
        title: updatedResource.title,
        description: updatedResource.description,
        category: updatedResource.category as UpdateResourcePayload['category'],
        visibility: updatedResource.visibility,
        academicLevel: updatedResource.academicLevel,
        department: updatedResource.department,
      };

      await adminHook.updateResource(resourceId, payload);
      if (onCacheInvalidate) {
        onCacheInvalidate();
      }
      setShowEditModal(false);
      setSelectedResource(null);
      onRefresh();
    } catch (error) {
      // Error handling is already done in the adminHook.updateResource method
      throw error;
    }
  };

  return {
    isEditing: adminHook.isLoading,
    selectAll,
    isDeleting,
    isRestoring,
    showAnalytics,
    showEditModal,
    confirmDelete,
    selectedCount,
    confirmRestore,
    clearSelection,
    toggleSelection,
    showDeleteModal,
    showRestoreModal,
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
    setShowRestoreModal,
    handleDeleteResource,
    handleDeleteSelected,
    handleRestoreSelected,
    handleRestoreResource,
  };
};

export default useResourceTable;
