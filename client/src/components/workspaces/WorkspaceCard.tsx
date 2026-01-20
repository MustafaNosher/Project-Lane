import type { Workspace } from "@/types/workspaceTypes";
import { Calendar, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { truncate } from "@/utils/utilityFunctions";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { deleteWorkspace } from "@/lib/slices/workspaceSlice";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useState } from "react";

interface WorkspaceCardProps {
  workspace: Workspace;
}

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  const dispatch = useAppDispatch();
 const { user: currentUser } = useAppSelector((state) => state.auth);
 const isOwner = workspace.owner.toString() === currentUser?._id?.toString();

  const [open, setOpen] = useState(false);

  const formattedDate = new Date(workspace.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleDelete = async () => {
        try {
            await dispatch(deleteWorkspace(workspace._id)).unwrap();
            setOpen(false);
        } catch (error) {
            console.error("Failed to delete workspace:", error);
        }
  };

  return (
    <div className=" select-none block group relative p-6 rounded-xl border border-white/10 bg-slate-900/40 backdrop-blur-sm hover:bg-slate-800/50 hover:border-indigo-500/30 transition-all duration-300">
      <Link to={`/workspace/${workspace._id}`} className="absolute inset-0" />
      
      {/* Top Border Accent */}
      <div 
        className="absolute top-0 left-0 right-0 h-1 rounded-t-xl opacity-80" 
        style={{ backgroundColor: workspace.color }}
      />

      <div className="flex flex-col h-full justify-between gap-4 relative z-10 pointer-events-none">
        <div>
            <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-xl text-white group-hover:text-indigo-200 transition-colors pointer-events-auto">
                    {workspace.name}
                </h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4 min-h-[40px] pointer-events-auto">
                {truncate(workspace.description, 80) || "No description provided."}
            </p>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 border-t border-white/5 pt-4 mt-auto">
            <div className="flex items-center gap-1.5 pointer-events-auto">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formattedDate}</span>
            </div>
            <div className="pointer-events-auto">
               <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    {isOwner && (
                    <Button
                        type="button"
                        variant="destructive"
                        className="h-8 px-3 text-xs bg-red-500 hover:bg-red-600 text-white border-none"
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setOpen(true);
                        }}
                    >
                        Delete
                    </Button>
                    )}
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] bg-slate-900 border-white/10 text-white" onClick={(e) => e.stopPropagation()}>
                    <DialogHeader>
                      <DialogTitle>Delete Workspace</DialogTitle>
                      <DialogDescription className="text-slate-400">
                        Are you sure you want to delete this workspace? This action cannot be undone and will delete all projects and tasks associated with it.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                       <DialogClose asChild>
                           <Button type="button" variant="outline" className="border-white/10 bg-transparent text-white hover:bg-white/10 hover:text-white">Cancel</Button>
                       </DialogClose>
                      <Button type="button" variant="destructive" onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Confirm Delete</Button>
                    </DialogFooter>
                  </DialogContent>
               </Dialog>
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md pointer-events-auto">
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-medium text-slate-300">{workspace.members.length}</span>
            </div>
        </div>
      </div>
    </div>
  );
}
