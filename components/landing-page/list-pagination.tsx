import { ChevronLeft, ChevronRight } from 'lucide-react';
import { darkCtaClass } from '@/components/landing-page/brand';

type ListPaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
};

const ListPagination = ({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  itemLabel = 'results',
}: ListPaginationProps) => {
  if (totalPages <= 1) return null;

  const startIndex = page * limit;
  const endIndex = Math.min(startIndex + limit, total);

  const pageNumbers: number[] = [];
  const maxVisible = 5;
  let start = Math.max(0, page - Math.floor(maxVisible / 2));
  const end = Math.min(totalPages, start + maxVisible);

  if (end - start < maxVisible) {
    start = Math.max(0, end - maxVisible);
  }

  for (let i = start; i < end; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="mt-10 border-t border-[#0A1628]/10 pt-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[#0A1628]/60">
          Showing{' '}
          <span className="font-semibold text-[#0A1628]">{startIndex + 1}</span>
          {' – '}
          <span className="font-semibold text-[#0A1628]">{endIndex}</span> of{' '}
          <span className="font-semibold text-[#0A1628]">{total}</span> {itemLabel}
        </p>

        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <button
            type="button"
            disabled={page <= 0}
            onClick={() => onPageChange(Math.max(0, page - 1))}
            className={`${darkCtaClass} sm:hidden disabled:opacity-40`}
          >
            Previous
          </button>
          <button
            type="button"
            disabled={page + 1 >= totalPages}
            onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
            className={`${darkCtaClass} sm:hidden disabled:opacity-40`}
          >
            Next
          </button>

          <nav
            aria-label="Pagination"
            className="hidden items-center gap-1 sm:flex"
          >
            <button
              type="button"
              disabled={page <= 0}
              onClick={() => onPageChange(Math.max(0, page - 1))}
              aria-label="Previous page"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#0A1628]/10 text-[#0A1628]/70 transition hover:border-[#005080]/30 hover:text-[#005080] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {pageNumbers.map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                aria-current={pageNum === page ? 'page' : undefined}
                onClick={() => onPageChange(pageNum)}
                className={`inline-flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-semibold transition ${
                  pageNum === page
                    ? 'bg-[#005080] text-white'
                    : 'text-[#0A1628]/75 hover:bg-[#0A1628]/5'
                }`}
              >
                {pageNum + 1}
              </button>
            ))}

            <button
              type="button"
              disabled={page + 1 >= totalPages}
              onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
              aria-label="Next page"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#0A1628]/10 text-[#0A1628]/70 transition hover:border-[#005080]/30 hover:text-[#005080] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default ListPagination;
