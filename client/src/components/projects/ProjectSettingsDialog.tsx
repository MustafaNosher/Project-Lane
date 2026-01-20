import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import {
  updateProjectThunk,
  deleteProjectThunk,
  addProjectMemberThunk,
} from "@/lib/slices/projectSlice";
import { fetchWorkspaceById } from "@/lib/slices/workspaceSlice";
import { Loader2, Trash2, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import type { Project } from "@/types/projectTypes";

interface ProjectSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export function ProjectSettingsDialog({
  isOpen,
  onClose,
  project,
}: ProjectSettingsDialogProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading } = useAppSelector((state) => state.projects);
  const { currentWorkspace } = useAppSelector((state) => state.workspace);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [newMemberId, setNewMemberId] = useState("");
  const [isAddingMember, setIsAddingMember] = useState(false);

  useEffect(() => {
    if (isOpen && project.workspace && (!currentWorkspace || currentWorkspace._id !== project.workspace)) {
       dispatch(fetchWorkspaceById(project.workspace));
    }
  }, [isOpen, project.workspace, currentWorkspace, dispatch]);

  const [formData, setFormData] = useState({
    title: project.title,
    description: project.description || "",
    status: project.status,
    startDate: project.startDate?.split("T")[0] || "",
    dueDate: project.dueDate?.split("T")[0] || "",
    tags: project.tags.join(", "),
    progress: project.progress,
  });

  useEffect(() => {
    setFormData({
      title: project.title,
      description: project.description || "",
      status: project.status,
      startDate: project.startDate?.split("T")[0] || "",
      dueDate: project.dueDate?.split("T")[0] || "",
      tags: project.tags.join(", "),
      progress: project.progress,
    });
  }, [project]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(
        updateProjectThunk({
          projectId: project._id,
          projectData: {
            ...formData,
            progress: Number(formData.progress),
          },
        })
      ).unwrap();
      onClose();
    } catch (error) {
      console.error("Failed to update project:", error);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    setIsDeleting(true);
    try {
      await dispatch(deleteProjectThunk(project._id)).unwrap();
      onClose();
      navigate(`/workspace/${project.workspace}`);
    } catch (error) {
      console.error("Failed to delete project:", error);
      setIsDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="
        sm:max-w-lg
        bg-slate-950
        border border-white/10
        text-slate-200
        shadow-xl
        rounded-2xl
      ">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-white">
            Project Settings
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-slate-300">
              Project Name
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="bg-slate-900 border-white/10 focus-visible:ring-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-300">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Project goals and details..."
              rows={3}
              className="resize-none h-[90px] bg-slate-900 border-white/10 focus-visible:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  handleSelectChange("status", value)
                }
              >
                <SelectTrigger className=" w-full bg-slate-900 border-white/10 focus:ring-indigo-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planning">Planning</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Need Info">Need Info</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Start Date</Label>
              <Input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="bg-slate-900 border-white/10 focus-visible:ring-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Due Date</Label>
              <Input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="bg-slate-900 border-white/10 focus-visible:ring-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Tags</Label>
            <Input
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="bg-slate-900 border-white/10 focus-visible:ring-indigo-500"
            />
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <Label className="text-slate-300">Team Members</Label>
              <span className="text-xs text-slate-500">{project.members?.length || 0} members</span>
            </div>
            
            <div className="flex gap-2">
                <Select value={newMemberId} onValueChange={setNewMemberId}>
                  <SelectTrigger className="flex-1 bg-slate-900 border-white/10 focus:ring-indigo-500">
                    <SelectValue placeholder="Select member to add..." />
                  </SelectTrigger>
                  <SelectContent>
                    {currentWorkspace?.members
                      ?.filter(wm => {
                          const wmId = typeof wm.user === 'string' ? wm.user : wm.user?._id;
                          return !project.members?.some(pm => {
                              const pmId = typeof pm.user === 'string' ? pm.user : pm.user?._id;
                              return String(pmId) === String(wmId);
                          });
                      })
                      .map((member) => (
                      <SelectItem 
                        key={(typeof member.user === 'string' ? member.user : member.user?._id) as string} 
                        value={(typeof member.user === 'string' ? member.user : member.user?._id) as string}
                      >
                        {(typeof member.user === 'object' && member.user?.name) ? member.user.name : "Unknown User"}
                      </SelectItem>
                    ))}
                    {(!currentWorkspace || currentWorkspace.members?.length === 0) && (
                         <div className="p-2 text-xs text-center text-slate-500">No workspace members found</div>
                    )}
                  </SelectContent>
                </Select>
                <Button 
                  type="button"
                  onClick={async () => {
                    if(!newMemberId) return;
                    setIsAddingMember(true);
                    try {
                        await dispatch(addProjectMemberThunk({ projectId: project._id, memberId: newMemberId })).unwrap();
                        setNewMemberId("");
                    } catch (error) {
                        console.error("Failed to add member:", error);
                    } finally {
                        setIsAddingMember(false);
                    }
                  }}
                  disabled={!newMemberId || isAddingMember}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {isAddingMember ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                </Button>
            </div>

            <ScrollArea className="h-[120px] rounded-md border border-white/10 bg-slate-900/50 p-4">
              <div className="space-y-3">
                {project.members?.map((member: any) => (
                  <div key={member.user?._id || member.user} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.user?.profilePicture} />
                        <AvatarFallback>{member.user?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                         <span className="text-sm font-medium text-slate-200">{member.user?.name}</span>
                         <span className="text-[10px] text-slate-500 capitalize">{member.role}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/10">
            <Button
              type="button"
              variant="ghost"
              onClick={handleDelete}
              disabled={loading || isDeleting}
              className={`
                transition-colors
                ${
                  confirmDelete
                    ? "text-rose-500 hover:text-rose-400 hover:bg-rose-500/10"
                    : "text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                }
              `}
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              {confirmDelete ? "Confirm Delete" : "Delete Project"}
            </Button>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading || isDeleting}
                className="border-white/10 text-slate-300 bg-red-500 hover:bg-red-400 hover:text-white transition-colors"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={loading || isDeleting}
                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"
              >
                {loading && !isDeleting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
