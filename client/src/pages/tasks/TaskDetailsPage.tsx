import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { 
  fetchTaskByIdThunk,

  updateTaskTitleThunk,
  updateTaskDescriptionThunk, 
  updateTaskPriorityThunk, 
  addSubTaskThunk, 
  updateSubTaskThunk, 
  addCommentThunk,
  updateTaskInState 
} from "@/lib/slices/taskSlice";
import { fetchProjectDetails } from "@/lib/slices/projectSlice";
import { TaskAssigneeSelector } from "@/components/tasks/TaskAssigneeSelector";
import { socket, joinTaskRoom, leaveTaskRoom } from "@/lib/socket";
import { 
  Loader2, 
  CheckCircle2, 
  Circle, 
  Plus, 
  MessageSquare,
  Paperclip, 
  Calendar,
  Send,
  ChevronLeft,
  Layout,
  FileText,
  ExternalLink,
  Pencil
} from "lucide-react";
import { uploadAttachmentThunk } from "@/lib/slices/taskSlice";
import { API_BASE_URL } from "@/config/routes";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { ALLOWED_MIME_TYPES,ALLOWED_EXTENSIONS,MAX_FILE_SIZE} from "../../constants.ts"
import { formatFileSize } from "@/utils/utilityFunctions";

export default function TaskDetailsPage() {

  const { taskId } = useParams<{ taskId: string }>(); // used to read params from URL
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const task = useAppSelector((state) => 
    state.tasks.tasks.find((t) => t._id === taskId)
  );
  const project = useAppSelector((state) =>
    state.projects.projects.find((p) => p._id === task?.project)
  );
  const { loading } = useAppSelector((state) => state.tasks);

  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [newSubtask, setNewSubtask] = useState("");
  const [newComment, setNewComment] = useState("");
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingTitle , setIsEditingTitle] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);


  
  const serverUrl = API_BASE_URL.replace('/api', '');

  useEffect(() => {
    if (taskId) {
      dispatch(fetchTaskByIdThunk(taskId));
      
      // Real-time updates via Socket.io
      joinTaskRoom(taskId);

      const handleTaskUpdated = (updatedTask: any) => {
        console.log("Real-time task update received:", updatedTask);
        dispatch(updateTaskInState(updatedTask));
      };

      socket.on("task_updated", handleTaskUpdated);

      return () => {
        leaveTaskRoom(taskId);
        socket.off("task_updated", handleTaskUpdated);
      };
    }
  }, [dispatch, taskId]);

  useEffect(() => {
    if (task?.project && !project) {
      const projectId = typeof task.project === 'string' ? task.project : (task.project as any)._id;
      if (projectId) {
         dispatch(fetchProjectDetails(projectId));
      }
    }
  }, [dispatch, task?.project, project]);

  useEffect(() => {
    if (task) {
      setDescription(task.description || "");
      setTitle(task.title || "");
    }
  }, [task]);

  const handleUpdateDescription = () => {
    if (taskId && description !== task?.description) {
      dispatch(updateTaskDescriptionThunk({ taskId, description: description.trim() }));
    }
    setIsEditingDescription(false);
  };

  const handleUpdateTitle = () => {
    if (taskId && title !== task?.title) {
      dispatch(updateTaskTitleThunk({ taskId, title : title.trim() }));
    }
    setIsEditingTitle(false);
  };

  const handleUpdatePriority = (priority: string) => {
    if (taskId) {
      dispatch(updateTaskPriorityThunk({ taskId, priority }));
    }
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskId && newSubtask.trim()) {
      dispatch(addSubTaskThunk({ taskId, title: newSubtask.trim() }));
      setNewSubtask("");
    }
  };

  const handleToggleSubtask = (subtaskId: string, completed: boolean) => {
    if (taskId) {
      dispatch(updateSubTaskThunk({ taskId, subtaskId, completed }));
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskId && newComment.trim()) {
      dispatch(addCommentThunk({ taskId, text: newComment.trim() }));
      setNewComment("");
    }
  };


const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!taskId || !file) return;

  if (file.size > MAX_FILE_SIZE) {
    alert("File size exceeds 5MB limit");
    e.target.value = "";
    return;
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    alert("Unsupported file type");
    e.target.value = "";
    return;
  }

  const extension = file.name.split(".").pop()?.toLowerCase();
  if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
    alert("Invalid file extension");
    e.target.value = "";
    return;
  }
  setIsUploading(true);

  try {
    await dispatch(uploadAttachmentThunk({ taskId, file })).unwrap();
  } catch (err: any) {
    alert(err || "Failed to upload file");
  } finally {
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }
};

const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  const cursor = e.target.selectionStart;

  setNewComment(value);
  setCursorPosition(cursor);

  const textBeforeCursor = value.slice(0, cursor || 0);
  const match = textBeforeCursor.match(/@(\w*)$/);

  if (match) {
    setShowMentions(true);
    setMentionQuery(match[1]);
  } else {
    setShowMentions(false);
    setMentionQuery("");
  }
};

const insertMention = (name: string) => {

  if (cursorPosition === null) return;

  const before = newComment.slice(0, cursorPosition).replace(/@\w*$/, `@${name} `);
  const after = newComment.slice(cursorPosition);

  setNewComment(before + after);
  setShowMentions(false);
  setMentionQuery("");
};


const members = project?.members || [];

const filteredMembers = members.filter((m) =>
  m.user.name.toLowerCase().includes(mentionQuery.toLowerCase())
);
const uniqueMembers = useMemo(() => {
  return Array.from(
    new Map(filteredMembers.map(m => [m.user._id, m])).values()
  );
}, [filteredMembers]);


  if (loading && !task) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-slate-400">
        <p>Task not found.</p>
        <Button variant="link" onClick={() => navigate(-1)} className="mt-4">
          <ChevronLeft className="w-4 h-4 mr-1" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 lg:p-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Header/Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="text-slate-400 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Project
          </Button>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Layout className="w-4 h-4" />
            <span>Task Details</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Status */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                  task.status === 'Done' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                  'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                }`}>
                  {task.status}
                </span>
                {isEditingTitle ? (
                  <div className="flex gap-2 items-center flex-1">
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="text-xl font-bold bg-slate-800/50 border-white/10 h-10"
                      autoFocus
                    />
                    <Button size="sm" onClick={handleUpdateTitle}>Save</Button>
                    <Button size="sm" variant="ghost" onClick={() => setIsEditingTitle(false)}>Cancel</Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 group">
                      <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400">
                        {task.title}
                      </h1>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsEditingTitle(true)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-slate-400 hover:text-white"
                      >
                         <Pencil className="w-4 h-4" />
                      </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Description</h2>
                {!isEditingDescription && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsEditingDescription(true)}
                    className="text-indigo-400 hover:text-indigo-300 h-8"
                  >
                    Edit
                  </Button>
                )}
              </div>
              
              {isEditingDescription ? (
                <div className="space-y-3">
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-slate-800/50 border-white/10 min-h-[120px] focus:border-indigo-500/50"
                    placeholder="Enter task description..."
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleUpdateDescription}>Save</Button>
                    <Button size="sm" variant="ghost" onClick={() => setIsEditingDescription(false)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <p className="text-slate-400 leading-relaxed">
                  {task.description || "No description provided."}
                </p>
              )}
            </div>

            {/* Subtasks */}
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/5">
              <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-6">Subtasks</h2>
              
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-1">
                {task.subtasks?.map((sub) => (
                  <div key={sub._id} className="flex items-center gap-3 group">
                    <button
                      onClick={() => handleToggleSubtask(sub._id, !sub.completed)}
                      className="transition-colors"
                      disabled={sub.completed}
                    >
                      {sub.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-600 hover:text-indigo-400" />
                      )}
                    </button>
                    <span className={`text-sm transition-colors ${
                      sub.completed ? 'text-slate-500 line-through' : 'text-slate-200'
                    }`}>
                      {sub.title}
                    </span>
                  </div>
                ))}

                {(!task.subtasks || task.subtasks.length === 0) && (
                  <p className="text-sm text-slate-500 italic">No subtasks added yet.</p>
                )}
              </div>

              <form onSubmit={handleAddSubtask} className="flex gap-2">
                <Input
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  placeholder="Add a subtask..."
                  className="bg-slate-800/30 border-white/5 h-10 focus:border-indigo-500/50"
                />
                <Button type="submit" size="sm" variant="outline" className="h-10 border-white/10 hover:bg-slate-800">
                  <Plus className="w-4 h-4" />
                </Button>
              </form>
            </div>

            {/* Attachments Section */}
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/5 space-y-6 max-h-60 overflow-y-auto pr-1">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Paperclip className="w-4 h-4" /> Attachments
                </h2>
                <input
                  type="file"
                  ref={fileInputRef}
                   accept= ".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="border-white/10 hover:bg-slate-800 text-xs h-8"
                >
                  {isUploading ? (
                    <Loader2 className="w-3 h-3 animate-spin mr-2" />
                  ) : (
                    <Plus className="w-3 h-3 mr-2" />
                  )}
                  Upload
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {task.attachments?.map((attachment) => (
                  <div 
                    key={attachment._id} 
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-white/5 group hover:border-indigo-500/30 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-200 truncate pr-2">
                          {attachment.fileName}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {formatFileSize(attachment.fileSize)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-slate-400 hover:text-white"
                        onClick={() => window.open(`${serverUrl}${attachment.fileUrl}`, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {(!task.attachments || task.attachments.length === 0) && (
                  <div className="md:col-span-2 border-2 border-dashed border-white/5 rounded-xl py-10 flex flex-col items-center justify-center">
                    <Paperclip className="w-8 h-8 text-slate-700 mb-2" />
                    <p className="text-xs text-slate-500 font-medium">No attachments yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Metadata Card */}
            <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Priority</Label>
                <Select value={task.priority} onValueChange={handleUpdatePriority}>
                  <SelectTrigger className="bg-slate-900/50 border-white/10 h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10 text-white">
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Due Date</Label>
                <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-900/50 p-3 rounded-lg border border-white/5">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  {task.dueDate && !isNaN(new Date(task.dueDate).getTime()) 
                    ? new Date(task.dueDate).toLocaleDateString() 
                    : "No deadline"}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Assigned To</Label>
                <div className="flex flex-wrap gap-2">
                  <TaskAssigneeSelector 
                    task={task} 
                    projectMembers={project?.members || []} 
                  />
                  {(!task.assignees || task.assignees.length === 0) && (
                    <div className="text-xs text-slate-500 italic flex items-center gap-2">
                       No one assigned
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="flex flex-col h-[400px] p-6 rounded-2xl bg-slate-900/50 border border-white/5 overflow-y-auto">
              <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-6 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" /> Discussion
              </h2>
              
              <ScrollArea className="flex-1 pr-4 mb-6">
                <div className="space-y-4">
                  {task.comments?.map((comment) => (
                    <div key={comment._id} className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <Avatar className="w-8 h-8 shrink-0">
                        <AvatarImage src={comment.author?.profilePicture} />
                        <AvatarFallback className="bg-slate-800 text-[10px] uppercase">
                          {comment.author?.name.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-white truncate pr-2">
                            {comment.author?.name}
                          </span>
                          <span className="text-[10px] text-slate-600 whitespace-nowrap">
                            {comment.createdAt && !isNaN(new Date(comment.createdAt).getTime()) 
                              ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })
                              : "Recently"}
                          </span>
                        </div>
                        <div className="bg-slate-800/40 p-3 rounded-2xl rounded-tl-none border border-white/5 overflow-wrap-anywhere">
                          <p className="text-xs text-slate-300 leading-relaxed wrap-break-word">
                            {comment.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {(!task.comments || task.comments.length === 0) && (
                    <div className="text-center py-10 opacity-30 flex flex-col items-center">
                      <MessageSquare className="w-10 h-10 mb-2" />
                      <p className="text-xs">No comments yet</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
            <form onSubmit={handleAddComment} className="relative">
                <Input
                  value={newComment}
                  // onChange={(e) => setNewComment(e.target.value)}
                  onChange={handleCommentChange}
                  placeholder="Write a comment..."
                  className="bg-slate-800/50 border-white/10 pr-12 focus:border-indigo-500/50 h-12 rounded-xl"
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  variant="ghost"
                  className="absolute right-1 top-1 text-indigo-400 hover:text-indigo-300"
                >
                  <Send className="w-4 h-4" />
                </Button>
                
                {showMentions && filteredMembers.length > 0 && (
                  <div className="absolute bottom-14 left-0 w-64 bg-slate-900 border border-white/10 rounded-xl shadow-lg z-50">
                    {uniqueMembers.map((member) => (
                      <button
                        key={member.user._id} 
                        type="button"
                        onClick={() => insertMention(member.user.name)}
                        className="flex items-center gap-2 px-3 py-2 w-full text-left hover:bg-slate-800"
                      >
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={member.user.profilePicture} />
                          <AvatarFallback>
                            {member.user.name.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs">{member.user.name}</span>
                      </button>
                    ))}
                  </div>
            )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
