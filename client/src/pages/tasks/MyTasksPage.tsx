import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { fetchMyTasksThunk } from "@/lib/slices/taskSlice";
import { MyTaskCard } from "@/components/tasks/MyTaskCard";
import { Loader2 } from "lucide-react";

export default function MyTasksPage() {
  const dispatch = useAppDispatch();
  const { tasks, loading, error } = useAppSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchMyTasksThunk());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <div className="text-center">
          <p className="text-rose-400 mb-2">Failed to load tasks</p>
          <p className="text-sm text-slate-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-8 overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          My Tasks
        </h1>
        <p className="text-slate-400 mt-2">
          View and manage tasks assigned to you across all projects
        </p>
      </div>

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[40vh] text-slate-500 border border-dashed border-slate-800 rounded-lg bg-slate-900/50">
          <p className="text-lg font-medium mb-1">No tasks assigned</p>
          <p className="text-sm">You don't have any tasks assigned to you yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tasks.map((task) => (
            <MyTaskCard key={task._id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}