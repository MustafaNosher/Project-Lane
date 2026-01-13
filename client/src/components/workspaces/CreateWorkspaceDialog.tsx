
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "@/lib/store";
import { createWorkspace } from "@/lib/slices/workspaceSlice";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

interface CreateWorkspaceFormData {
    name: string;
    description: string;
    color: string;
}

const PRESET_COLORS = [
    "#6366f1", // Indigo
    "#a855f7", // Purple
    "#ec4899", // Pink
    "#ef4444", // Red
    "#f97316", // Orange
    "#eab308", // Yellow
    "#22c55e", // Green
    "#06b6d4", // Cyan
    "#3b82f6", // Blue
];

export function CreateWorkspaceDialog() {
    const [open, setOpen] = useState(false);
    const dispatch = useAppDispatch();
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue, watch } = useForm<CreateWorkspaceFormData>({
        defaultValues: {
            name: "",
            description: "",
            color: PRESET_COLORS[0]
        }
    });

    const selectedColor = watch("color");

    const onSubmit = async (data: CreateWorkspaceFormData) => {
        try {
            await dispatch(createWorkspace(data)).unwrap();
            setOpen(false);
            reset();
        } catch (error) {
            console.error("Failed to create workspace:", error);
            // Optionally set form error here
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-0">
                    <Plus className="w-4 h-4 mr-2" />
                    New Workspace
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-slate-950 border-white/10 text-slate-200">
                <DialogHeader>
                    <DialogTitle>Create Workspace</DialogTitle>
                    <DialogDescription>
                        Create a new workspace to organize your projects and teams.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Workspace Name</Label>
                        <Input
                            id="name"
                            placeholder="e.g. Engineering Team"
                            className="bg-slate-900 border-white/10 focus-visible:ring-indigo-500"
                            {...register("name", { required: "Name is required" })}
                        />
                        {errors.name && <p className="text-red-400 text-xs">{errors.name.message}</p>}
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="What's this workspace for?"
                            className="bg-slate-900 border-white/10 focus-visible:ring-indigo-500 resize-none"
                            {...register("description")}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Theme Color</Label>
                        <div className="flex flex-wrap gap-3 p-1">
                            {PRESET_COLORS.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => setValue("color", color)}
                                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                                        selectedColor === color 
                                            ? "border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.3)]" 
                                            : "border-transparent hover:scale-105"
                                    }`}
                                    style={{ backgroundColor: color }}
                                    aria-label={`Select color ${color}`}
                                />
                            ))}
                        </div>
                        <input type="hidden" {...register("color", { required: true })} />
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                            {isSubmitting ? "Creating..." : "Create Workspace"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
