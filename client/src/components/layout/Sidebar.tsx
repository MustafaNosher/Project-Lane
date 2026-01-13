
import { NavLink } from "react-router-dom";
import { Layout, CheckSquare, LogOut, LayoutDashboard } from "lucide-react";
import { useAppDispatch } from "@/lib/store";
import { logoutUser } from "@/lib/slices/authSlice";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Dashboard from "@/pages/Dashboard";

const sidebarLinks = [
  {name:"Dashboard", href: "/dashboard", icon: LayoutDashboard},
  { name: "Workspaces", href: "/workspaces", icon: Layout },
  { name: "My Tasks", href: "/tasks", icon: CheckSquare },
];

export function Sidebar() {
    const dispatch = useAppDispatch();

    const handleLogout = () => {
        dispatch(logoutUser());
    };

  return (
    <aside className="hidden md:flex fixed left-0 top-[73px] bottom-0 w-64 border-r border-white/10 bg-slate-950/50 backdrop-blur-xl z-40 flex-col justify-between py-6 px-4">
      <div className="space-y-2">
        <div className="mb-6 px-4">
             <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Menu
            </h2>
        </div>
        
        <nav className="space-y-1">
          {sidebarLinks.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group",
                  isActive
                    ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_-3px_rgba(99,102,241,0.2)]"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="pt-6 border-t border-white/10">
        <Button 
            variant="ghost" 
            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 gap-3"
            onClick={handleLogout}
        >
            <LogOut className="h-5 w-5" />
            Sign Out
        </Button>
      </div>
    </aside>
  );
}
