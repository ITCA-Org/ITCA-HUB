import React from 'react';
import { TableProps } from '@/types/interfaces/table';
import { RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { NetworkError, EmptyState, NoResults } from '@/components/dashboard/error-messages';

function Table<T>({
  data,
  columns,
  keyExtractor,
  renderRow,
  page,
  limit,
  total,
  totalPages,
  setPage,
  isLoading = false,
  isError = false,
  title = 'Items',
  onRefresh,
  hasActiveFilters = false,
  onClearFilters,
  searchTerm,
  emptyTitle,
  emptyDescription,
  emptyIcon,
  skeleton,
  selectable = false,
  selectedItems = {},
  onSelectItem,
  onSelectAll,
  selectedCount = 0,
  onClearSelection,
  selectionActions,
  onRowClick,
  onRowDoubleClick,
}: TableProps<T>) {
  const startIndex = page * limit;
  const endIndex = Math.min(startIndex + limit, total);

  if (isLoading && skeleton) {
    return <>{skeleton}</>;
  }

  if (isError && onRefresh) {
    return <NetworkError onRetry={onRefresh} />;
  }

  if (data.length === 0) {
    if (hasActiveFilters && onClearFilters) {
      return <NoResults filterTerm={searchTerm} onClearFilters={onClearFilters} />;
    }
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        uploadIcon={emptyIcon}
        showRefreshButton={!!onRefresh}
        onRefresh={onRefresh}
      />
    );
  }

  return (
    <div className="rounded-2xl bg-white">
      <div className="px-5 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <div className="flex items-center mt-2 sm:mt-0">
          {selectable && selectedCount > 0 ? (
            <div className="flex flex-col gap-4 md:flex-row md:items-center space-x-3">
              <span className="text-sm font-medium text-blue-800">
                {selectedCount} item{selectedCount > 1 ? 's' : ''} selected
              </span>
              <button
                onClick={onClearSelection}
                className="inline-flex items-center rounded-lg bg-gray-100 text-gray-700 px-3 py-1.5 text-sm font-medium hover:bg-gray-200 cursor-pointer"
              >
                Clear Selection
              </button>
              <button
                onClick={onSelectAll}
                className="inline-flex items-center rounded-lg bg-blue-100 text-blue-700 px-3 py-1.5 text-sm font-medium hover:bg-blue-200 cursor-pointer"
              >
                {data.every((item) => selectedItems[keyExtractor(item)])
                  ? 'Deselect All'
                  : 'Select All'}
              </button>
              {selectionActions}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Showing {data.length} of {total} {title.toLowerCase()}
            </p>
          )}
          {onRefresh && (
            <button
              onClick={onRefresh}
              title={`Refresh ${title.toLowerCase()}`}
              className="ml-3 p-1 rounded-md text-gray-400 hover:text-blue-500 hover:bg-blue-50"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto hide-scrollbar">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`px-6 py-3 text-left text-sm font-normal uppercase tracking-wider text-gray-500 ${column.className || ''}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {data.map((item, index) => {
              const key = keyExtractor(item);
              const isSelected = selectable && selectedItems[key];

              return (
                <tr
                  key={key}
                  onClick={(e) => {
                    if (selectable && onSelectItem) {
                      onSelectItem(item, e);
                    } else if (onRowClick) {
                      onRowClick(item, e);
                    }
                  }}
                  onDoubleClick={onRowDoubleClick ? (e) => onRowDoubleClick(item, e) : undefined}
                  className={`${
                    isSelected ? 'bg-amber-100' : index % 2 === 1 ? 'bg-gray-100/80' : ''
                  } hover:bg-amber-100/70 border-none transition-colors ${selectable || onRowClick ? 'cursor-pointer' : ''}`}
                >
                  {renderRow(item, index)}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="border-t border-gray-200 px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
              <span className="font-medium">{endIndex}</span> of{' '}
              <span className="font-medium">{total}</span> results
            </p>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="p-2 text-gray-400 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  let pageNumber;

                  if (totalPages <= 7) {
                    pageNumber = i;
                  } else if (page < 3) {
                    pageNumber = i < 5 ? i : totalPages - (7 - i);
                  } else if (page > totalPages - 4) {
                    pageNumber = totalPages - 7 + i;
                  } else {
                    pageNumber = page - 3 + i;
                  }

                  if (pageNumber >= 0 && pageNumber < totalPages) {
                    if ((i === 5 && pageNumber < totalPages - 1) || (i === 1 && pageNumber > 1)) {
                      return (
                        <span key={`dots-${pageNumber}`} className="px-3 py-1 text-gray-700">
                          ...
                        </span>
                      );
                    }

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setPage(pageNumber)}
                        className={`px-3 py-1 text-sm font-semibold rounded-md ${
                          page === pageNumber
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {pageNumber + 1}
                      </button>
                    );
                  }

                  return null;
                })}
              </div>

              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page === totalPages - 1}
                className="p-2 text-gray-400 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Table;
