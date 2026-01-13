
export default function Dashboard() {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-white">
                Dashboard
            </h1>
            <p className="text-slate-400">
                Welcome back to ProjectLane. Here's what's happening today.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
             {/* Placeholder Cards */}
            <div className="p-6 rounded-xl border border-white/10 bg-slate-900/50 backdrop-blur-sm">
                <h3 className="font-semibold text-lg text-white mb-2">Total Tasks</h3>
                <p className="text-slate-500 text-sm">No pending tasks for today.</p>
            </div>
             <div className="p-6 rounded-xl border border-white/10 bg-slate-900/50 backdrop-blur-sm">
                <h3 className="font-semibold text-lg text-white mb-2">Total Active Projects</h3>
                <p className="text-slate-500 text-sm">You are part of 0 active projects.</p>
            </div>
             <div className="p-6 rounded-xl border border-white/10 bg-slate-900/50 backdrop-blur-sm">
                <h3 className="font-semibold text-lg text-white mb-2">Recent Activity</h3>
                <p className="text-slate-500 text-sm">No recent activity to show.</p>
            </div>
        </div>
      </div>
    );
  }
