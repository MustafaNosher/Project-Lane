
import {  useDroppable} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { TaskCard } from "@/components/tasks/TaskCard";

export default function KanbanColumn({ column, tasks, projectMembers }: { column: any, tasks: any[], projectMembers: any[] }) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const Icon = column.icon;

  return (
    <div 
      ref={setNodeRef}
      className={`flex flex-col gap-4 p-3 rounded-xl transition-all min-h-[400px] ${
        isOver ? "bg-indigo-500/5 ring-2 ring-indigo-500/20 ring-dashed scale-[1.01]" : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between px-2 mb-2">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${column.color}`} />
          <h3 className="font-semibold text-slate-200 text-sm tracking-wide uppercase">
            {column.label}
          </h3>
          <span className="bg-slate-800 text-slate-400 text-[10px] px-2 py-0.5 rounded-full border border-white/5 font-bold">
            {tasks.length}
          </span>
        </div>
      </div>

      <div 
        ref={setNodeRef}
        className="flex flex-col gap-3 p-2 rounded-xl bg-slate-900/30 border border-white/5 
                   max-h-[500px] overflow-y-auto overflow-x-hidden 
                   scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
      >
        <SortableContext 
          id={column.id}
          items={tasks.map(t => t._id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard 
              key={task._id} 
              task={task} 
              projectMembers={projectMembers}
            />
          ))}
        </SortableContext>
        
        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-slate-600 border border-dashed border-white/5 rounded-lg h-full">
            <p className="text-xs">No tasks</p>
          </div>
        )}
      </div>
    </div>
  );
}