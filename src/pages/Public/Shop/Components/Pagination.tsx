import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPage: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPage, onPageChange }: PaginationProps) => {
  if (totalPage <= 1) return null;

  const pages = Array.from({ length: totalPage }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 py-8">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
          currentPage === 1
            ? "text-text-muted/30 cursor-not-allowed"
            : "text-text-primary hover:bg-bg-surface border border-border-main"
        }`}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-2">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-xl font-black transition-all duration-300 text-xs ${
              currentPage === page
                ? "bg-secondary text-white shadow-lg shadow-secondary/30 scale-110"
                : "text-text-primary hover:bg-bg-surface border border-border-main"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(Math.min(totalPage, currentPage + 1))}
        disabled={currentPage === totalPage}
        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
          currentPage === totalPage
            ? "text-text-muted/30 cursor-not-allowed"
            : "text-text-primary hover:bg-bg-surface border border-border-main"
        }`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Pagination;
