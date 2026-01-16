import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { createTask } from "@/lib/slices/taskSlice";
import { Loader2 } from "lucide-react";
import type { Project } from "@/types/projectTypes";

interface CreateTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export function CreateTaskDialog({ isOpen, onClose, project }: CreateTaskDialogProps) {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.tasks);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "To Do",
    priority: "Medium",
    dueDate: "",
    assignees: [] as string[],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMemberToggle = (userId: string) => {
    setFormData((prev) => {
      const isSelected = prev.assignees.includes(userId);
      if (isSelected) {
        return { ...prev, assignees: prev.assignees.filter((id) => id !== userId) };
      } else {
        return { ...prev, assignees: [...prev.assignees, userId] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(createTask({ 
        projectId: project._id, 
        taskData: formData 
      })).unwrap();
      onClose();
      setFormData({
        title: "",
        description: "",
        status: "To Do",
        priority: "Medium",
        dueDate: "",
        assignees: [],
      });
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px] bg-slate-950 border border-white/10 text-slate-200 rounded-2xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-white">
            Create New Task
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="task-title" className="text-slate-300">
              Task Title
            </Label>
            <Input
              id="task-title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Design Login Page"
              required
              className="bg-slate-900 border-white/10 focus-visible:ring-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-description" className="text-slate-300">
              Description
            </Label>
            <Textarea
              id="task-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Task details..."
              className="resize-none h-[70px] bg-slate-900 border-white/10 focus-visible:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="task-status" className="text-slate-300">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger
                  id="task-status"
                  className="w-full bg-slate-900 border-white/10 focus:ring-indigo-500"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Review">Review</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="task-priority" className="text-slate-300">
                Priority
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleSelectChange("priority", value)}
              >
                <SelectTrigger
                  id="task-priority"
                  className="w-full bg-slate-900 border-white/10 focus:ring-indigo-500"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-dueDate" className="text-slate-300">
              Due Date
            </Label>
            <Input
              id="task-dueDate"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              className="bg-slate-900 border-white/10 focus-visible:ring-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Assign To</Label>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto rounded-xl bg-slate-900/50 border border-white/5 p-3 custom-scrollbar">
              {Array.from(new Map(project.members.map(m => [m.user._id, m])).values()).map((member) => (
                <div key={member.user._id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`task-member-${member.user._id}`}
                    checked={formData.assignees.includes(member.user._id)}
                    onChange={() => handleMemberToggle(member.user._id)}
                    className="h-4 w-4 rounded border-white/20 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label
                    htmlFor={`task-member-${member.user._id}`}
                    className="text-sm text-slate-300 cursor-pointer"
                  >
                    {member.user.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="pt-4 gap-2">
            <Button
              type="button"
              onClick={onClose}
              variant="ghost"
              className="border-white/10 text-slate-300 bg-red-500 hover:bg-red-400 hover:text-white transition-colors"
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
