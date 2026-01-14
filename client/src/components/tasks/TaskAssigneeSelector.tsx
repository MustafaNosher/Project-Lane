import { useAppDispatch } from "@/lib/store";
import { updateTaskAssigneesThunk } from "@/lib/slices/taskSlice";
import type { Task } from "@/types/taskTypes";
import type { ProjectMember } from "@/types/projectTypes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Plus, Check } from "lucide-react";

interface TaskAssigneeSelectorProps {
  task: Task;
  projectMembers: ProjectMember[];
}

export function TaskAssigneeSelector({ task, projectMembers }: TaskAssigneeSelectorProps) {
  const dispatch = useAppDispatch();

  const handleToggleAssignee = async (userId: string) => {
    try {
      const currentAssignees = task.assignees || [];
      const currentAssigneeIds = currentAssignees.map((a) => {
        if (typeof a === 'string') return a;
        return a._id || (a as any).id;
      });

      let newAssigneeIds: string[];

      if (currentAssigneeIds.includes(userId)) {
        newAssigneeIds = currentAssigneeIds.filter((id) => id !== userId);
      } else {
        newAssigneeIds = [...currentAssigneeIds, userId];
      }

      await dispatch(updateTaskAssigneesThunk({ taskId: task._id, assignees: newAssigneeIds })).unwrap();
    } catch (err: any) {
      console.error("Failed to update assignees:", err);
      alert(err || "Failed to update assignees");
    }
  };

  const isAssigned = (userId: string) => {
    return task.assignees?.some((a) => {
      const id = typeof a === 'string' ? a : (a._id || (a as any).id);
      return id === userId;
    });
  };

  return (
    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
      <div className="flex -space-x-2 overflow-hidden">
        {task.assignees?.map((user) => {
            const userData = typeof user === 'string' ? null : user;
            if (!userData) return null;
            return (
                <Avatar key={userData._id} className="w-6 h-6 border-2 border-slate-900 ring-1 ring-white/10">
                    <AvatarImage src={userData.profilePicture} />
                    <AvatarFallback className="bg-indigo-500 text-[8px] uppercase font-bold">
                        {userData.name?.slice(0, 2) || "??"}
                    </AvatarFallback>
                </Avatar>
            );
        })}
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-6 h-6 rounded-full bg-slate-800/50 border border-white/5 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <Plus className="w-3 h-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-2 bg-slate-900 border-white/10 shadow-2xl" align="start">
          <div className="space-y-1">
            <h4 className="px-2 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Assign to Task
            </h4>
            <div className="max-h-60 overflow-y-auto pr-1">
              {projectMembers?.map((member) => {
                const isUserPopulated = typeof member.user !== 'string';
                const memberUserId = isUserPopulated ? (member.user as any)._id : member.user;
                const memberUserName = isUserPopulated ? (member.user as any).name : "Unknown User";
                const memberUserPic = isUserPopulated ? (member.user as any).profilePicture : null;

                return (
                  <button
                    key={memberUserId}
                    onClick={() => handleToggleAssignee(memberUserId)}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={memberUserPic} />
                        <AvatarFallback className="bg-slate-800 text-[10px] uppercase font-bold text-slate-300">
                          {memberUserName?.slice(0, 2) || "??"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <p className="text-sm font-medium text-slate-200 group-hover:text-white">
                          {memberUserName}
                        </p>
                        <p className="text-[10px] text-slate-500 capitalize">
                          {member.role}
                        </p>
                      </div>
                    </div>
                    {isAssigned(memberUserId) && (
                      <Check className="w-4 h-4 text-indigo-400" />
                    )}
                  </button>
                );
              })}
              
              {(!projectMembers || projectMembers.length === 0) && (
                <p className="text-center py-4 text-xs text-slate-500 italic">
                  No members found
                </p>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
