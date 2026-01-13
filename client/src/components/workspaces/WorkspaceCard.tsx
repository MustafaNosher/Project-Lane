import type { Workspace } from "@/types/workspaceTypes";
import { Calendar, Users } from "lucide-react";
import { Link } from "react-router-dom";

interface WorkspaceCardProps {
  workspace: Workspace;
}

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  // Truncate description function
  const truncate = (str: string | undefined, length: number) => {
    if (!str) return "";
    return str.length > length ? str.substring(0, length) + "..." : str;
  };

  const formattedDate = new Date(workspace.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link to={`/workspace/${workspace._id}`} className="block group relative p-6 rounded-xl border border-white/10 bg-slate-900/40 backdrop-blur-sm hover:bg-slate-800/50 hover:border-indigo-500/30 transition-all duration-300">
      
      {/* Top Border Accent */}
      <div 
        className="absolute top-0 left-0 right-0 h-1 rounded-t-xl opacity-80" 
        style={{ backgroundColor: workspace.color }}
      />

      <div className="flex flex-col h-full justify-between gap-4">
        <div>
            <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-xl text-white group-hover:text-indigo-200 transition-colors">
                    {workspace.name}
                </h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4 min-h-[40px]">
                {truncate(workspace.description, 80) || "No description provided."}
            </p>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 border-t border-white/5 pt-4 mt-auto">
            <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formattedDate}</span>
            </div>
            
            <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md">
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-medium text-slate-300">{workspace.members.length}</span>
            </div>
        </div>
      </div>
    </Link>
  );
}
