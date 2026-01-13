import type { Project } from "@/types/projectTypes";
import { CheckSquare, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "In Progress":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Planning":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "Need Info":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "Cancelled":
        return "bg-rose-500/20 text-rose-400 border-rose-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const formattedDate = new Date(project?.dueDate?.toString() || "").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link
      to={`/projects/${project._id}`}
      className="group block p-6 rounded-xl border border-white/10 bg-slate-900/40 backdrop-blur-sm hover:bg-slate-800/50 hover:border-indigo-500/30 transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-bold text-lg text-white group-hover:text-indigo-300 transition-colors">
          {project.title}
        </h3>
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
            project.status
          )}`}
        >
          {project.status}
        </span>
      </div>

      <p className="text-slate-400 text-sm mb-6 line-clamp-2 min-h-[40px]">
        {project.description || "No description provided."}
      </p>

      <div className="space-y-4">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-500">Progress</span>
            <span className="text-slate-300">{project.progress}%</span>
          </div>
          <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 transition-all duration-500 ease-out"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-white/5">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>{project.tasks?.length || 0} Tasks</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>{project.members.length} Members</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span> Due Date: {formattedDate}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
