import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPage: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPage, onPageChange }: PaginationProps) => {
  if (totalPage <= 1) return null;

  // Helper to generate pages with ellipses
  const getPageNumbers = () => {
    const delta = 1; // Show current page + 1 page on either side
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPage; i++) {
      if (
        i === 1 ||
        i === totalPage ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l > 2) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 py-2">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
          currentPage === 1
            ? "text-slate-300 dark:text-slate-700 cursor-not-allowed border border-slate-100 dark:border-slate-800"
            : "text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-slate-200 dark:border-slate-800"
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-2">
        {pages.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`dots-${index}`}
                className="w-9 h-9 flex items-center justify-center text-slate-400 dark:text-slate-500 font-medium text-xs"
              >
                ...
              </span>
            );
          }
          return (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`w-9 h-9 rounded-xl font-semibold transition-all duration-300 text-xs ${
                currentPage === page
                  ? "bg-primary text-white"
                  : "text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-slate-200 dark:border-slate-800"
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(Math.min(totalPage, currentPage + 1))}
        disabled={currentPage === totalPage}
        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
          currentPage === totalPage
            ? "text-slate-300 dark:text-slate-700 cursor-not-allowed border border-slate-100 dark:border-slate-800"
            : "text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-slate-200 dark:border-slate-800"
        }`}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;
