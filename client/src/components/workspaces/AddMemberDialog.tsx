
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { fetchAllUsers } from "@/lib/slices/authSlice";
import { addWorkspaceMember } from "@/lib/slices/workspaceSlice";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, UserPlus, Check, Loader2 } from "lucide-react";
import type { Workspace } from "@/types/workspaceTypes";
import type { User } from "@/types/authTypes";

interface AddMemberDialogProps {
    workspace: Workspace;
}

export function AddMemberDialog({ workspace }: AddMemberDialogProps) {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const dispatch = useAppDispatch();
    const { allUsers, isLoading: authLoading } = useAppSelector((state) => state.auth);
    const { isLoading: workspaceLoading } = useAppSelector((state) => state.workspace);

    useEffect(() => {
        if (open && !allUsers) {
            dispatch(fetchAllUsers());
        }
    }, [open, allUsers, dispatch]);

    const filteredUsers = allUsers?.filter((user: User) => 
        (user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
         user.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
        user._id !== workspace.owner
    );

    const isMember = (userId: string) => {
        return workspace.members.some(m => m.user._id === userId);
    };

    const handleAddMember = async (userId: string) => {
        try {
            await dispatch(addWorkspaceMember({ 
                workspaceId: workspace._id, 
                userId, 
                role: "member" 
            })).unwrap();
        } catch (error) {
            console.error("Failed to add member:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Members
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-slate-950 border-white/10 text-slate-200">
                <DialogHeader>
                    <DialogTitle>Add Workspace Members</DialogTitle>
                    <DialogDescription>
                        Search and invite users to join this workspace.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 pt-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <Input
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 bg-slate-900 border-white/10 focus-visible:ring-indigo-500"
                        />
                    </div>

                    <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                        {authLoading && !allUsers ? (
                            <div className="flex items-center justify-center py-8 text-slate-500">
                                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                                <span>Loading users...</span>
                            </div>
                        ) : filteredUsers && filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <div 
                                    key={user._id} 
                                    className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-white/5 hover:bg-slate-900 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9 border border-white/10">
                                            <AvatarImage src={user.profilePicture} />
                                            <AvatarFallback className="bg-indigo-500 text-white text-xs">
                                                {user.name.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-white">{user.name}</span>
                                            <span className="text-xs text-slate-500">{user.email}</span>
                                        </div>
                                    </div>
                                    
                                    {isMember(user._id) ? (
                                        <div className="flex items-center gap-1 text-xs text-emerald-400 font-medium bg-emerald-400/10 px-2 py-1 rounded-full">
                                            <Check className="w-3 h-3" />
                                            Member
                                        </div>
                                    ) : (
                                        <Button 
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleAddMember(user._id)}
                                            disabled={workspaceLoading}
                                            className="h-8 px-3 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10"
                                        >
                                            {workspaceLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Add"}
                                        </Button>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-slate-500">
                                No users found matching your search.
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
