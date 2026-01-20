
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector, type RootState } from "@/lib/store";
import { logoutUser } from "@/lib/slices/authSlice";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut, Menu, X, Layout, CheckSquare, LayoutDashboard } from "lucide-react"; // Import Menu, X and icons
import { cn } from "@/lib/utils"; // Import cn
import NotificationBadge from "../notifications/NotificationBadge";
import NotificationList from "../notifications/NotificationList";

export function Navbar() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    setIsMobileMenuOpen(false);
  };

  const mobileLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Workspaces", href: "/workspaces", icon: Layout },
    { name: "My Tasks", href: "/tasks", icon: CheckSquare },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-slate-400 hover:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
        
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="text-2xl font-extrabold tracking-tight bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">
            ProjectLane
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-white hover:bg-white/10">
                    <div className="relative">
                        <User className="h-5 w-5 hidden" /> 
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5"
                        >
                          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                        </svg>
                         <NotificationBadge />
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 bg-slate-900 border-white/10 text-slate-200" align="end" forceMount>
                <DropdownMenuLabel className="font-normal border-b border-white/10 pb-2 mb-2">
                    <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">Notifications</span>
                    </div>
                </DropdownMenuLabel>
                <NotificationList />
            </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-white/10 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950">
              <Avatar className="h-10 w-10 border border-white/10">
                <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                <AvatarFallback className="bg-indigo-500 text-white font-medium">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-slate-900 border-white/10 text-slate-200" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-white">{user?.name}</p>
                <p className="text-xs leading-none text-slate-400">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer group">
            <Link
            to="/profile"
            className="flex items-center cursor-pointer group focus:bg-white/10 focus:text-white"
            >
              <User className="mr-2 h-4 w-4 text-slate-400 group-hover:text-indigo-400" />
              <span>Profile Settings</span>
            </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem onClick={handleLogout} className="focus:bg-red-500/20 focus:text-red-400 text-red-400 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {isMobileMenuOpen && (
        <div className="absolute top-[73px] left-0 right-0 bottom-0 h-[calc(100vh-73px)] bg-slate-950/95 backdrop-blur-md z-40 p-4 border-t border-white/10 md:hidden flex flex-col animate-in slide-in-from-top-4 duration-200">
           <nav className="space-y-1">
              {mobileLinks.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    )
                  }
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </NavLink>
              ))}
              <div className="pt-4 mt-4 border-t border-white/10">
                <Button 
                    variant="ghost" 
                    className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 gap-3"
                    onClick={handleLogout}
                >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                </Button>
              </div>
            </nav>
        </div>
      )}
    </nav>
  );
}
