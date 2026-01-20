import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { fetchProjectsByWorkspace } from "@/lib/slices/projectSlice";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import { AddMemberDialog } from "@/components/workspaces/AddMemberDialog";
import { Button } from "@/components/ui/button";
import { Plus, Users, Layout, Search, Filter } from "lucide-react";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { Input } from "@/components/ui/input";

const ITEMS_PER_PAGE = 6;

export default function WorkspaceDetails() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const dispatch = useAppDispatch();
  const { projects, loading: projectsLoading, lastFetchedWorkspaceId } = useAppSelector(
    (state) => state.projects
  );
  const { currentWorkspace, isLoading: workspaceLoading } = useAppSelector((state) => state.workspace);
  const { user: currentUser } = useAppSelector((state) => state.auth);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);

  const isOwner = currentUser?._id === currentWorkspace?.owner;

  useEffect(() => {
     if (workspaceId) {
      dispatch(fetchProjectsByWorkspace(workspaceId));
    }
  }, [dispatch, workspaceId]);
  
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProjects = filteredProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  if (workspaceLoading && !currentWorkspace) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (!currentWorkspace && !workspaceLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
        <p>Workspace not found.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {projectsLoading && !projects.length && (
        <div className="fixed inset-0 bg-slate-950/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
        </div>
      )}
      {/* Header */}
      <div className="mb-8 p-8 rounded-2xl bg-linear-to-r from-indigo-900/50 to-purple-900/50 border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Layout className="w-64 h-64" />
        </div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {currentWorkspace?.name}
              </h1>
              <p className="text-indigo-200 max-w-2xl">
                {currentWorkspace?.description}
              </p>
            </div>
            <div className="flex flex-col gap-8">
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>

            {isOwner && currentWorkspace && (
              <AddMemberDialog workspace={currentWorkspace} />
            )}
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm text-indigo-300/80">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{currentWorkspace?.members.length} Members</span>
            </div>
            <div className="flex items-center gap-2">
              <Layout className="w-4 h-4" />
              <span>{projects.length} Projects</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-slate-900/50 border-white/10 focus:border-indigo-500/50 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          <Filter className="w-4 h-4 text-slate-500" />
          {["All", "Planning", "In Progress", "Completed", "Need Info", "Cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                statusFilter === status
                  ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                  : "bg-slate-800/50 text-slate-400 border border-white/5 hover:bg-slate-800"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentProjects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
        
        <PaginationControls 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
        </>
      ) : (
        <div className="text-center py-20 bg-slate-900/20 rounded-xl border border-dashed border-white/10">
          <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Layout className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No projects found</h3>
          <p className="text-slate-400 mb-6 max-w-sm mx-auto">
            {searchQuery || statusFilter !== "All" 
              ? "Try adjusting your search or filters to find what you're looking for."
              : "Get started by creating your first project in this workspace."}
          </p>
          {!searchQuery && statusFilter === "All" && (
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(true)}
              className="border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10"
            >
              Create Project
            </Button>
          )}
        </div>
      )}

      {currentWorkspace && (
        <CreateProjectDialog
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          workspace={currentWorkspace}
        />
      )}
    </div>
  );
}
