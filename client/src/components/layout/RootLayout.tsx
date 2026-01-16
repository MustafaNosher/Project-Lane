import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { fetchCurrentUser } from "@/lib/slices/authSlice";


export default function RootLayout() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(fetchCurrentUser());
    }
  }, [isAuthenticated, user, dispatch]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30 dark font-sans">
         {/* Background Gradients & Effects (consistent with Auth) */}
         <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px]" />
        </div>

      <Navbar />
      <Sidebar />      
      <main className="pl-0 md:pl-64 pt-[73px] min-h-screen relative z-10">
        <div className="p-4 md:p-8">
            <Outlet />
        </div>
      </main>
    </div>
  );
}
