import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { fetchProjectDetails } from "@/lib/slices/projectSlice";
import { fetchProjectTasks } from "@/lib/slices/taskSlice";
import { TaskCard } from "@/components/tasks/TaskCard";
import { CreateTaskDialog } from "@/components/tasks/CreateTaskDialog";
import { ProjectSettingsDialog } from "@/components/projects/ProjectSettingsDialog";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Settings, 
  ChevronLeft, 
  Layout, 
  Clock, 
  CheckCircle2, 
  Circle, 
  RefreshCcw, 
  AlertCircle 
} from "lucide-react";

const STATUS_COLUMNS = [
  { id: "To Do", label: "To Do", icon: Circle, color: "text-slate-400" },
  { id: "In Progress", label: "In Progress", icon: RefreshCcw, color: "text-blue-400" },
  { id: "Review", label: "Review", icon: AlertCircle, color: "text-amber-400" },
  { id: "Done", label: "Done", icon: CheckCircle2, color: "text-emerald-400" },
];

export default function ProjectDetails() {
  const { projectId } = useParams<{ projectId: string }>();
  const dispatch = useAppDispatch();
  
  const project = useAppSelector((state) => 
    state.projects.projects.find((p) => p._id === projectId)
  );
  const { tasks, loading: tasksLoading, error: tasksError } = useAppSelector((state) => state.tasks);
  const { loading: projectLoading, error: projectError } = useAppSelector((state) => state.projects);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  useEffect(() => {
    if (projectId) {
      dispatch(fetchProjectDetails(projectId));
      dispatch(fetchProjectTasks(projectId));
    }
  }, [dispatch, projectId]);

  // Handle errors
  if (projectError || tasksError) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Error Loading Project</h2>
        <p>{projectError || tasksError}</p>
        <Button onClick={() => window.location.reload()} className="mt-6">
          Try Again
        </Button>
      </div>
    );
  }

  if (projectLoading || (tasksLoading && tasks.length === 0)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
        <p>Project not found.</p>
        <Link to="/workspaces" className="text-indigo-400 hover:underline mt-4 flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" /> Back to Workspaces
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Navigation & Actions */}
      <div className="flex justify-between items-center mb-8">
        <Link 
          to={`/workspace/${project.workspace}`} 
          className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Workspace
        </Link>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSettingsOpen(true)}
            className="border-white/10 bg-slate-800/50 hover:bg-slate-800 text-slate-300"
          >
            <Settings className="w-4 h-4 mr-2" />
            Project Settings
          </Button>
          <Button
            size="sm"
            onClick={() => setIsAddTaskOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Project Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
            <Layout className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{project.title}</h1>
            <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Due {project.dueDate && !isNaN(new Date(project.dueDate).getTime()) 
                  ? new Date(project.dueDate).toLocaleDateString() 
                  : "No date set"}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                project.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
              }`}>
                {project.status}
              </span>
            </div>
          </div>
        </div>
        <p className="text-slate-400 max-w-3xl leading-relaxed">
          {project.description}
        </p>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[500px]">
        {STATUS_COLUMNS.map((column) => {
          const columnTasks = tasks.filter((t) => t.status === column.id);
          const Icon = column.icon;

          return (
            <div key={column.id} className="flex flex-col gap-4">
              <div className="flex items-center justify-between px-2 mb-2">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${column.color}`} />
                  <h3 className="font-semibold text-slate-200 text-sm tracking-wide uppercase">
                    {column.label}
                  </h3>
                  <span className="bg-slate-800 text-slate-400 text-[10px] px-2 py-0.5 rounded-full border border-white/5 font-bold">
                    {columnTasks.length}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 p-2 rounded-xl bg-slate-900/30 border border-white/5 h-full">
                {columnTasks.map((task) => (
                  <TaskCard 
                    key={task._id} 
                    task={task} 
                  />
                ))}
                
                {columnTasks.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-600 border border-dashed border-white/5 rounded-lg h-full">
                    <p className="text-xs">No tasks</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dialogs */}
      {project && (
        <>
          <ProjectSettingsDialog
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            project={project}
          />
          <CreateTaskDialog
            isOpen={isAddTaskOpen}
            onClose={() => setIsAddTaskOpen(false)}
            project={project}
          />
        </>
      )}
    </div>
  );
}
