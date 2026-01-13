import { Link } from "react-router-dom";
import type { Task } from "@/types/taskTypes";
import { CheckSquare, Clock } from "lucide-react";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "Medium":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Low":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  return (
    <Link 
      to={`/task/${task._id}`}
      className="group p-4 rounded-lg border border-white/10 bg-slate-900/60 hover:border-indigo-500/30 transition-all cursor-pointer shadow-sm hover:shadow-indigo-500/5 block"
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-slate-200 group-hover:text-white transition-colors">
          {task.title}
        </h4>
      </div>

      {task.description && (
        <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {task.description}
        </p>
      )}

      <div className="flex items-center gap-3 mt-auto pt-3 border-t border-white/5">
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${getPriorityColor(
            task.priority
          )}`}
        >
          {task.priority}
        </span>

        {totalSubtasks > 0 && (
          <div className="flex items-center gap-1 text-[10px] text-slate-400">
            <CheckSquare className="w-3 h-3" />
            <span>
              {completedSubtasks}/{totalSubtasks}
            </span>
          </div>
        )}

        {task.dueDate && (
          <div className="flex items-center gap-1 text-[10px] text-slate-500 ml-auto">
            <Clock className="w-3 h-3" />
            <span>{new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
