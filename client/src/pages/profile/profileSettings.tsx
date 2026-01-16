import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { updateProfile, updatePassword, clearError } from "@/lib/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2, User, Lock,AlertCircle } from "lucide-react";
import { toast } from "sonner";


export default function ProfileSettings() {
  const dispatch = useAppDispatch();
  const { user, isLoading, error } = useAppSelector((state) => state.auth);

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(updateProfile(profileData));
    if (updateProfile.fulfilled.match(result)) {
      toast.success("Profile Updated", {
        description: "Your profile information has been successfully updated.",
      });
    } else {
      toast.error("Update Failed", {
        description: (result.payload as string) || "Something went wrong.",
      });
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Error", {
        description: "New passwords do not match.",
      });
      return;
    }

    const result = await dispatch(updatePassword({
      oldPassword: passwordData.oldPassword,
      newPassword: passwordData.newPassword,
    }));

    if (updatePassword.fulfilled.match(result)) {
      toast.success("Password Changed", {
        description: "Your password has been successfully updated.",
      });
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } else {
      toast.error("Password Update Failed", {
        description: (result.payload as string) || "Something went wrong.",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Profile Settings</h1>
        <p className="text-slate-400">Manage your account information and security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Information */}
        <Card className="bg-slate-900/50 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <User className="w-5 h-5 text-indigo-400" />
              General Information
            </CardTitle>
            <CardDescription className="text-slate-400">Update your account name and email.</CardDescription>
          </CardHeader>
          <form onSubmit={handleProfileUpdate}>
            <CardContent className="space-y-8">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-300">Full Name</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="bg-slate-950/50 border-white/10 text-white focus:border-indigo-500/50"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="bg-slate-950/50 border-white/10 text-white focus:border-indigo-500/50"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="mt-24.5">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-lg shadow-indigo-500/20"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Save Changes
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Password Management */}
        <Card className="bg-slate-900/50 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Lock className="w-5 h-5 text-purple-400" />
              Security
            </CardTitle>
            <CardDescription className="text-slate-400">Update your password to keep your account secure.</CardDescription>
          </CardHeader>
          <form onSubmit={handlePasswordUpdate}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="oldPassword" className="text-slate-300">Current Password</Label>
                <Input
                  id="oldPassword"
                  type="password"
                  value={passwordData.oldPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                  className="bg-slate-950/50 border-white/10 text-white focus:border-indigo-500/50"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-slate-300">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="bg-slate-950/50 border-white/10 text-white focus:border-indigo-500/50"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-300">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="bg-slate-950/50 border-white/10 text-white focus:border-indigo-500/50"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="mt-10">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white transition-all shadow-lg shadow-purple-500/20"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Update Password
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => dispatch(clearError())}
            className="ml-auto hover:bg-red-500/20 text-red-400"
          >
            Dismiss
          </Button>
        </div>
      )}
    </div>
  );
}