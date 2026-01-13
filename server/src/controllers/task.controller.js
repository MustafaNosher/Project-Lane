import projectModel from "../models/project.js";
import workspaceModel from "../models/workspace.js"
import taskModel from "../models/task.js";
import commentModel from "../models/comment.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { validateRequestBody } from "../utils/validateRequest.js";

//Create Task
const createTask = async (req , res)=> {

    try{
        const {projectId} = req.params;

        const errorMsg = validateRequestBody(req.body, ["title"]);

        if (errorMsg) return errorResponse(res, 400, errorMsg);

        const { title, description, status, priority, dueDate, assignees } = req.body;

        const project = await projectModel.findById(projectId);

        if(!project){

            return errorResponse(res , 404 , "Project not found");
        }

        const isMember = project.members.some(
            (member)=> member.user.toString() === req.user._id.toString()
        );
        if(!isMember){
            return errorResponse(res , 403 , "You are not a member of this project");
        }   

        const task = await taskModel.create({
            title,
            description,
            status,
            priority,
            dueDate,
            assignees,
            project: projectId,
            createdBy: req.user._id,
        });

        const populatedTask = await taskModel.findById(task._id).populate("assignees", "name profilePicture");

        project.tasks.push(task._id);
        await project.save();

        return successResponse(res , 201 , "Task created successfully" , populatedTask);
    }
    catch(error){

        console.error("Error in Creating Task:", error);
        return errorResponse(res , 500 , "Internal server error");
    }
}

//Fetch Task By Id
const getTaskById = async (req , res)=> {
    try{
        const {taskId} = req.params;

        const task = await taskModel.findById(taskId)
        .populate("assignees", "name profilePicture")
        .populate({
            path: "comments",
            populate: { path: "author", select: "name profilePicture" }
        });

        if(!task){
            return errorResponse(res , 404 , "Task not found");
        }
        return successResponse(res , 200 , "Task fetched successfully" , task);
    }
    catch(error){
        console.error("Error in Getting Task:", error);
        return errorResponse(res , 500 , "Internal server error");
    }
}

//Update a Tasks Title
const updateTaskTitle = async (req , res)=> {

    try{
        const errorMsg = validateRequestBody(req.body, ["title"]);

        if(errorMsg){

            return errorResponse(res , 400 , errorMsg);
        }
        const {taskId} = req.params;

        const {title} = req.body;

        const task = await taskModel.findById(taskId);

        if(!task){
            return errorResponse(res , 404 , "Task not found");
        }

        const project = await projectModel.findById(task.project);

        if(!project){
            return errorResponse(res , 404 , "Project not found");
        }

        const isMember = project.members.some(
            (member)=> member.user.toString() === req.user._id.toString()
        );
        if(!isMember){
            return errorResponse(res , 403 , "You are not a member of this project");
        }   

        const updatedTask = await taskModel.findByIdAndUpdate(taskId,{ title },{ new: true , runValidators: true })
            .populate("assignees", "name profilePicture")
            .populate({
                path: "comments",
                populate: { path: "author", select: "name profilePicture" }
            });

        if(!updatedTask){
            return errorResponse(res , 404 , "Task not found");
        }

        return successResponse(res , 200 , "Task title updated successfully" , updatedTask);
    }
    catch(error){
        console.error("Error in Updating Task Title:", error);
        return errorResponse(res , 500 , "Internal server error");
    }
}

//Update a Task Description

const updateTaskDescription = async (req , res)=> {

    try{
        const errorMsg = validateRequestBody(req.body, ["description"]);

        if(errorMsg){

            return errorResponse(res , 400 , errorMsg);
        }
        const {taskId} = req.params;

        const {description} = req.body;
        
        if (typeof description !== "string" || description.length > 30) {
            return errorResponse(
                res,400,
                "Description must be between 0 and 30 characters"
            );
        }

        const task = await taskModel.findById(taskId);

        if(!task){
            return errorResponse(res , 404 , "Task not found");
        }

        const project = await projectModel.findById(task.project);

        if(!project){
            return errorResponse(res , 404 , "Project not found");
        }

        const isMember = project.members.some(
            (member)=> member.user.toString() === req.user._id.toString()
        );
        if(!isMember){
            return errorResponse(res , 403 , "You are not a member of this project");
        }   

        const updatedTask = await taskModel.findByIdAndUpdate(taskId,{ description },{ new: true , runValidators: true })
            .populate("assignees", "name profilePicture")
            .populate({
                path: "comments",
                populate: { path: "author", select: "name profilePicture" }
            });

        if(!updatedTask){
            return errorResponse(res , 404 , "Task not found");
        }

        return successResponse(res , 200 , "Task description updated successfully" , updatedTask);
    }
    catch(error){
        console.error("Error in Updating Task Description:", error);
        return errorResponse(res , 500 , "Internal server error");
    }
}

//Update Task status
const updateTaskStatus = async (req, res)=>{
    try{
        const errorMsg = validateRequestBody(req.body, ["status"]);

        if(errorMsg){

            return errorResponse(res , 400 , errorMsg);
        }
        const {taskId} = req.params;

        const {status} = req.body;

        const task = await taskModel.findById(taskId);

        if(!task){
            return errorResponse(res , 404 , "Task not found");
        }

        const project = await projectModel.findById(task.project);

        if(!project){
            return errorResponse(res , 404 , "Project not found");
        }

        const isMember = project.members.some(
            (member)=> member.user.toString() === req.user._id.toString()
        );
        if(!isMember){
            return errorResponse(res , 403 , "You are not a member of this project");
        }   

        const updatedTask = await taskModel.findByIdAndUpdate(taskId,{ status },{ new: true , runValidators: true })
            .populate("assignees", "name profilePicture")
            .populate({
                path: "comments",
                populate: { path: "author", select: "name profilePicture" }
            });

        if(!updatedTask){
            return errorResponse(res , 404 , "Task not found");
        }

        return successResponse(res , 200 , "Task status updated successfully" , updatedTask);
    }
    catch(error){
        console.error("Error in Updating Task Status:", error);
        return errorResponse(res , 500 , "Internal server error");
    }
}

//Update Task Assignees
const updateTaskAssignees = async (req , res)=>{
    try{
        const errorMsg = validateRequestBody(req.body, ["assignees"]);

        if(errorMsg){

            return errorResponse(res , 400 , errorMsg);
        }
        const {taskId} = req.params;

        const {assignees} = req.body;

        const task = await taskModel.findById(taskId);

        if(!task){
            return errorResponse(res , 404 , "Task not found");
        }

        const project = await projectModel.findById(task.project);

        if(!project){
            return errorResponse(res , 404 , "Project not found");
        }

        const isMember = project.members.some(
            (member)=> member.user.toString() === req.user._id.toString()
        );
        if(!isMember){
            return errorResponse(res , 403 , "You are not a member of this project");
        }   

        const updatedTask = await taskModel.findByIdAndUpdate(taskId,{ assignees },{ new: true , runValidators: true });

        if(!updatedTask){
            return errorResponse(res , 404 , "Task not found");
        }

        return successResponse(res , 200 , "Task assignees updated successfully" , updatedTask);
    }
    catch(error){
        console.error("Error in Updating Task Assignees:", error);
        return errorResponse(res , 500 , "Internal server error");
    }
}

//Update Task Priority
const updateTaskPriority = async (req , res)=>{
    try{
        const errorMsg = validateRequestBody(req.body, ["priority"]);

        if(errorMsg){

            return errorResponse(res , 400 , errorMsg);
        }
        const {taskId} = req.params;

        const {priority} = req.body;

        const task = await taskModel.findById(taskId);

        if(!task){
            return errorResponse(res , 404 , "Task not found");
        }

        const project = await projectModel.findById(task.project);

        if(!project){
            return errorResponse(res , 404 , "Project not found");
        }

        const isMember = project.members.some(
            (member)=> member.user.toString() === req.user._id.toString()
        );
        if(!isMember){
            return errorResponse(res , 403 , "You are not a member of this project");
        }   

        const updatedTask = await taskModel.findByIdAndUpdate(taskId,{ priority },{ new: true , runValidators: true })
            .populate("assignees", "name profilePicture")
            .populate({
                path: "comments",
                populate: { path: "author", select: "name profilePicture" }
            });

        if(!updatedTask){
            return errorResponse(res , 404 , "Task not found");
        }

        return successResponse(res , 200 , "Task priority updated successfully" , updatedTask);
    }
    catch(error){
        console.error("Error in Updating Task Priority:", error);
        return errorResponse(res , 500 , "Internal server error");
    }
}

//Add SubTask
const addSubTask = async (req ,res)=>{
    try{
        const errorMsg = validateRequestBody(req.body, ["title"]);

        if(errorMsg){

            return errorResponse(res , 400 , errorMsg);
        }
        const {taskId} = req.params;

        const {title} = req.body;

        const task = await taskModel.findById(taskId);

        if(!task){
            return errorResponse(res , 404 , "Task not found");
        }

        const project = await projectModel.findById(task.project);

        if(!project){
            return errorResponse(res , 404 , "Project not found");
        }

        const isMember = project.members.some(
            (member)=> member.user.toString() === req.user._id.toString()
        );
        if(!isMember){
            return errorResponse(res , 403 , "You are not a member of this project");
        }   

       const updatedTask = await taskModel.findByIdAndUpdate(
        taskId,
        {
            $push: {
                subtasks: {
                    title,
                    completed: false
                 }
                }
            },
            { new: true, runValidators: true }
        ).populate("assignees", "name profilePicture")
        .populate({
            path: "comments",
            populate: { path: "author", select: "name profilePicture" }
        });


        return successResponse(res , 200 , "Subtask added successfully" , updatedTask);
    }
    catch(error){
        console.error("Error in Adding Subtask:", error);
        return errorResponse(res , 500 , "Internal server error");
    }
}

//Update SubTask (Mark it as completed)
const updateSubTask = async (req,res)=>{
    try{
        const errorMsg = validateRequestBody(req.body, ["completed"]);

        if(errorMsg){

            return errorResponse(res , 400 , errorMsg);
        }
        const {taskId, subtaskId} = req.params;

        const {completed} = req.body;

        const task = await taskModel.findById(taskId);

        if(!task){
            return errorResponse(res , 404 , "Task not found");
        }

        const project = await projectModel.findById(task.project);

        if(!project){

            return errorResponse(res , 404 , "Project not found");
        }

        const isMember = project.members.some(

            (member)=> member.user.toString() === req.user._id.toString()
        );
        
        if(!isMember){

            return errorResponse(res , 403 , "You are not a member of this project");
        }  
        
        const updatedSubtask = await taskModel.findOneAndUpdate(
            {
                _id: taskId,
                "subtasks._id": subtaskId
            },
            {
                $set: {
                    "subtasks.$.completed": completed
                }
            },
            {
                new: true,
                runValidators: true
            }
        ).populate("assignees", "name profilePicture")
        .populate({
            path: "comments",
            populate: { path: "author", select: "name profilePicture" }
        });
        if (!updatedSubtask) {

            return errorResponse(res , 404 , "Subtask not found");
        }

        return successResponse(res , 200 , "Subtask updated successfully" , updatedSubtask);
    }
    catch(error){
        console.error("Error in Adding Subtask:", error);
        return errorResponse(res , 500 , "Internal server error");
    }
}

//Add comments to a task
const addComment = async(req,res)=>{
    try{
        const errorMsg = validateRequestBody(req.body, ["text"]);

        if(errorMsg){

            return errorResponse(res , 400 , errorMsg);
        }

        const {taskId} = req.params;

        const {text} = req.body;

        const task = await taskModel.findById(taskId);

        if(!task){
            return errorResponse(res , 404 , "Task not found");
        }

        const project = await projectModel.findById(task.project);

        if(!project){
            return errorResponse(res , 404 , "Project not found");
        }

        const isMember = project.members.some(
            (member)=> member.user.toString() === req.user._id.toString()
        );
        if(!isMember){
            return errorResponse(res , 403 , "You are not a member of this project");
        }   

        const addedComment = await commentModel.create({
            task: taskId,
            author: req.user._id,
            text
        });

        const updatedTask = await taskModel.findByIdAndUpdate(
            taskId,
            { $push: { comments: addedComment._id } },
            { new: true, runValidators: true }
        ).populate("assignees", "name profilePicture")
        .populate({
            path: "comments",
            populate: { path: "author", select: "name profilePicture" }
        });

        return successResponse(res , 200 , "Comment added successfully" , updatedTask);
    }
    catch(error){
        console.error("Error in Adding Comment:", error);
        return errorResponse(res , 500 , "Internal server error");
    }
}


//Get Comments for a Task
const getCommentsofTask = async (req,res)=>{

    try{
        const {taskId} = req.params;

        const task = await taskModel.findById(taskId);

        if(!task){
            return errorResponse(res , 404 , "Task not found");
        }

         const comments = await Comment.find({ task: taskId })
         .populate("author", "name profilePicture")
         .sort({ createdAt: -1 });

        return successResponse(res , 200 , "Comments fetched successfully" , comments);
    }
    catch(error){
        console.error("Error in Getting Comments of Task:", error);
        return errorResponse(res , 500 , "Internal server error");
    }
}

//Get Tasks of a specific user
const getMyTasks = async (req,res)=>{
    try{
       const tasks = await taskModel.find({ assignees: { $in: [req.user._id] } })
      .populate("project", "title workspace")
      .sort({ createdAt: -1 });
      
      return successResponse(res , 200 , "Tasks fetched successfully" , tasks);
    }
    catch(error){
        console.error("Error in Getting My Tasks:", error);
        return errorResponse(res , 500 , "Internal server error");
    }
}

// Upload Attachment
const uploadAttachment = async (req, res) => {
  try {
    const { taskId } = req.params;
    if (!req.file) {
      return errorResponse(res, 400, "No file uploaded");
    }

    const task = await taskModel.findById(taskId);
    if (!task) {
      return errorResponse(res, 404, "Task not found");
    }

    const project = await projectModel.findById(task.project);
    if (!project) {
      return errorResponse(res, 404, "Project not found");
    }

    const isMember = project.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );
    if (!isMember) {
      return errorResponse(res, 403, "You are not a member of this project");
    }

    const attachment = {
      fileName: req.file.originalname,
      fileUrl: `/uploads/attachments/${req.file.filename}`,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      uploadedBy: req.user._id,
    };

    const updatedTask = await taskModel.findByIdAndUpdate(
      taskId,
      { $push: { attachments: attachment } },
      { new: true, runValidators: true }
    )
      .populate("assignees", "name profilePicture")
      .populate({
        path: "comments",
        populate: { path: "author", select: "name profilePicture" },
      })
      .populate("attachments.uploadedBy", "name profilePicture");

    return successResponse(res, 200, "File uploaded successfully", updatedTask);
  } catch (error) {
    console.error("Error in Uploading Attachment:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};

export{
    createTask,
    getTaskById,
    updateTaskTitle, 
    updateTaskDescription,
    updateTaskStatus,
    updateTaskAssignees,
    updateTaskPriority,
    addSubTask,
    updateSubTask,
    getCommentsofTask,
    addComment,
    getMyTasks,
    uploadAttachment
}