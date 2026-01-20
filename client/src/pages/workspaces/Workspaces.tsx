
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { fetchWorkspaces } from "@/lib/slices/workspaceSlice";
import { CreateWorkspaceDialog } from "@/components/workspaces/CreateWorkspaceDialog";
import { WorkspaceCard } from "@/components/workspaces/WorkspaceCard";
import { Loader2 } from "lucide-react";
import { PaginationControls } from "@/components/ui/pagination-controls";

const ITEMS_PER_PAGE = 6;

export default function Workspaces() {
  const dispatch = useAppDispatch();
  const { workspaces, isLoading, error, isFetched } = useAppSelector((state) => state.workspace);
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(workspaces.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentWorkspaces = workspaces.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  
  useEffect(() => {
    if (!isFetched) {
        dispatch(fetchWorkspaces());
    }
  }, [dispatch, isFetched]);

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Workspaces</h1>
            <p className="text-slate-400">Manage your team's workspaces and projects.</p>
        </div>
        <CreateWorkspaceDialog />
      </div>

      {/* Content */}
      {isLoading && workspaces.length === 0 ? (
        <div className="flex justify-center items-center h-64">
             <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      ): workspaces.length === 0 ? (
        <div className="text-center py-20 rounded-xl border border-dashed border-white/10 bg-white/5">
            <h3 className="text-lg font-medium text-white mb-2">No workspaces yet</h3>
            <p className="text-slate-400 mb-6 max-w-sm mx-auto">
                Create your first workspace to start collaborating!
            </p>
        </div>
      ) : (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentWorkspaces.map((workspace) => (
                <WorkspaceCard key={workspace._id} workspace={workspace} />
            ))}
        </div>
        <PaginationControls 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
        />
        </>
      )}
    </div>
  );
}
