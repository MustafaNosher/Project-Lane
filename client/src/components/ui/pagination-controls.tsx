import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-8 w-8 border-white/10 bg-slate-900/50 hover:bg-slate-800 text-slate-400"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div className="flex items-center gap-1 mx-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "ghost"}
            size="sm"
            onClick={() => onPageChange(page)}
            className={`h-8 w-8 p-0 text-xs font-medium ${
              currentPage === page
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {page}
          </Button>
        ))}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-8 w-8 border-white/10 bg-slate-900/50 hover:bg-slate-800 text-slate-400"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
