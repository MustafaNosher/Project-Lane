import { useEffect } from "react";
import { useAppDispatch, useAppSelector, type RootState } from "@/lib/store";
import { fetchDashboardStats } from "@/lib/slices/authSlice";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { user, dashboardStats, isLoading } = useAppSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Welcome back, {user?.name} !
        </h1>
        <p className="text-slate-400">
          Here's what's Happening Today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-4">
        {/* Stats Cards */}
        <div className="p-6 rounded-xl border border-white/10 bg-slate-900/50 backdrop-blur-sm">
          <h3 className="font-semibold text-lg text-white mb-2">Total Tasks</h3>
          <p className="text-slate-500 text-sm">
            {isLoading ? "Loading..." : `You have ${dashboardStats?.pendingTasksCount || 0} pending tasks.`}
          </p>
        </div>
        <div className="p-6 rounded-xl border border-white/10 bg-slate-900/50 backdrop-blur-sm">
          <h3 className="font-semibold text-lg text-white mb-2">Total Active Projects</h3>
          <p className="text-slate-500 text-sm">
            {isLoading ? "Loading..." : `You are part of ${dashboardStats?.activeProjectsCount || 0} active projects.`}
          </p>
        </div>
      </div>
    </div>
  );
}
