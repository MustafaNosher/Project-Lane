import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { createProject } from "@/lib/slices/projectSlice";
import { Loader2 } from "lucide-react";
import type { Workspace } from "@/types/workspaceTypes";

interface CreateProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  workspace: Workspace;
}

function isStartDateBeforeDueDate(startDate?: string, dueDate?: string) {
  if (!startDate || !dueDate) return true; // allow empty dates
  return new Date(startDate) <= new Date(dueDate);
}


export function CreateProjectDialog({ isOpen, onClose, workspace }: CreateProjectDialogProps) {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.projects);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Planning",
    startDate: "",
    dueDate: "",
    tags: "",
    members: [] as string[],
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
      const isSelected = prev.members.includes(userId);
      if (isSelected) {
        return { ...prev, members: prev.members.filter((id) => id !== userId) };
      } else {
        return { ...prev, members: [...prev.members, userId] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isStartDateBeforeDueDate(formData.startDate, formData.dueDate)) {
      alert("Start date must be before the due date.");
      return;
    }
    
    try {
        const projectData: any = {
            ...formData,
            members: formData.members.map(userId => ({ user: userId, role: "contributor" }))
        };

        // Remove empty strings for dates to avoid Mongoose validation errors
        if (!projectData.startDate) delete projectData.startDate;
        if (!projectData.dueDate) delete projectData.dueDate;

        await dispatch(createProject({ 
            workspaceId: workspace._id, 
            projectData
        })).unwrap();
        onClose();
        // Reset form
        setFormData({
            title: "",
            description: "",
            status: "Planning",
            startDate: "",
            dueDate: "",
            tags: "",
            members: [],
        });
    } catch (error) {
        console.error("Failed to create project:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Project Name</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Website Redesign"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Project goals and details..."
              className="resize-none overflow-y-auto h-[90px]"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
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

             <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="frontend, design"
                />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Assign Members</Label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-md p-2">
                {workspace.members.map((member) => (
                    <div key={member.user._id} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id={`member-${member.user._id}`}
                            checked={formData.members.includes(member.user._id)}
                            onChange={() => handleMemberToggle(member.user._id)}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor={`member-${member.user._id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {member.user.name} ({member.role})
                        </label>
                    </div>
                ))}
            </div>
             <p className="text-xs text-muted-foreground">Select members from this workspace.</p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
