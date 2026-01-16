
import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ROUTES } from "@/config/routes";

export default function AuthPage() {
  const location = useLocation();
  const [isSignIn, setIsSignIn] = useState(true);

  useEffect(() => {
    if (location.pathname === ROUTES.AUTH.SIGN_UP) {
      setIsSignIn(false);
    } else {
      setIsSignIn(true);
    }
  }, [location.pathname]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-4 overflow-hidden bg-slate-950 text-slate-200 selection:bg-indigo-500/30 dark">
        {/* Background Gradients & Effects */}
        <div className="absolute inset-0 z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
            <div className="absolute top-[20%] right-[20%] w-[20%] h-[20%] rounded-full bg-purple-500/10 blur-[80px]" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-md">
            <div className="mb-8 text-center">
                <h1 className="text-5xl font-extrabold tracking-tight bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">
                    ProjectLane
                </h1>
                <p className="mt-2 text-sm font-medium text-slate-400 uppercase tracking-widest">
                    Manage What’s Next
                </p>
            </div>

            <Card className="w-full border-slate-800 bg-slate-900/50 backdrop-blur-xl shadow-2xl ring-1 ring-white/10">
                <CardHeader className="space-y-1 pb-6">
                    <CardTitle className="text-2xl text-center font-bold text-white tracking-tight">
                        {isSignIn ? "Welcome Back" : "Join the Future"}
                    </CardTitle>
                    <CardDescription className="text-center text-slate-400 text-sm">
                        {isSignIn
                            ? "Sign in to access your intelligent workspace"
                            : "Create your account and build better workflows"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isSignIn ? <SignInForm /> : <SignUpForm />}
                    <div className="mt-6 text-center text-sm text-slate-500">
                        {isSignIn ? (
                            <p>
                                New here?{" "}
                                <Link
                                    to={ROUTES.AUTH.SIGN_UP}
                                    className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors hover:underline underline-offset-4"
                                >
                                    Create account
                                </Link>
                            </p>
                        ) : (
                            <p>
                                Already a member?{" "}
                                <Link
                                    to={ROUTES.AUTH.SIGN_IN}
                                    className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors hover:underline underline-offset-4"
                                >
                                    Sign in
                                </Link>
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
        
        {/* Footer info/decoration */}
       <div className="absolute bottom-4 text-xs text-slate-300 font-mono">
        © {new Date().getFullYear()} ProjectLane. All rights reserved.
        </div>
    </div>
  );
}
