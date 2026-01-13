
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { fetchWorkspaces } from "@/lib/slices/workspaceSlice";
import { CreateWorkspaceDialog } from "@/components/workspaces/CreateWorkspaceDialog";
import { WorkspaceCard } from "@/components/workspaces/WorkspaceCard";
import { Loader2 } from "lucide-react";

export default function Workspaces() {
  const dispatch = useAppDispatch();
  const { workspaces, isLoading, error } = useAppSelector((state) => state.workspace);

  useEffect(() => {
    dispatch(fetchWorkspaces());
  }, [dispatch]);

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
      ) : error ? (
         <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
            Error loading workspaces: {error}
        </div>
      ) : workspaces.length === 0 ? (
        <div className="text-center py-20 rounded-xl border border-dashed border-white/10 bg-white/5">
            <h3 className="text-lg font-medium text-white mb-2">No workspaces yet</h3>
            <p className="text-slate-400 mb-6 max-w-sm mx-auto">
                Create your first workspace to start collaborating with your team on projects using the button above.
            </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.map((workspace) => (
                <WorkspaceCard key={workspace._id} workspace={workspace} />
            ))}
        </div>
      )}
    </div>
  );
}
