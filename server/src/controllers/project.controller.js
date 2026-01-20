import projectModel from "../models/project.js";
import workspaceModel from "../models/workspace.js"
import taskModel from "../models/task.js";
import Comment from "../models/comment.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { validateRequestBody } from "../utils/validateRequest.js";

const createProject = async (req , res)=>{

    try{
        const {workspaceId} = req.params;

        const errorMsg = validateRequestBody(req.body, ["title"]);

        if (errorMsg) {
            return errorResponse(res, 400, errorMsg);
        }
        const { title, description, status, startDate, dueDate, members, tags } = req.body;

        const workspace = await workspaceModel.findById(workspaceId);

        if(!workspace){
            return errorResponse(res , 404 , "Workspace not found");
        }

        const isMember = workspace.members.some(
            (member)=> (member.user?._id || member.user).toString() === req.user._id.toString()
        );

        if(!isMember){
            return errorResponse(res , 403 , "You are not a member of this workspace");
        } 
        //tags is an array of strings
        const tagSeperated = tags ? tags.split(",").map(tag => tag.trim()) : [];

        const projectMembers = [ 
            { user: req.user._id, role: "manager" }, 
            ...(members || []).filter(m => m.user !== req.user._id.toString()) 
        ];

        const project = await projectModel.create({
            title,
            description,
            status,
            startDate,
            dueDate,
            tags :tagSeperated ,
            workspace: workspaceId,
            createdBy: req.user._id,
            members:projectMembers
        });

        // save the project within the respective workspace
        await workspaceModel.findByIdAndUpdate(
            workspaceId,
            { $push: { projects: project._id } },
            { new: true, runValidators: true }
        );

        const populatedProject = await projectModel.findById(project._id).populate("members.user", "name profilePicture");

        return successResponse(res , 201 , "Project created successfully" , populatedProject);

    }catch(error){
        console.log(error);
        return errorResponse(res , 500 , "Internal server error");
    }
}

const getProjectDetails = async (req , res)=>{
    try{
        const {projectId} = req.params;

        const project = await projectModel.findById(projectId).populate("members.user", "name profilePicture");

        if(!project){
            return errorResponse(res , 404 , "Project not found");
        }
        const isMember = project.members.some(
            (member)=> (member.user?._id || member.user).toString() === req.user._id.toString()
        );
        if(!isMember){
            return errorResponse(res , 403 , "You are not a member of this project");
        }   
        return successResponse(res , 200 , "Project details fetched successfully" , project);
    }
    catch(error){

        console.log(error);
        return errorResponse(res , 500 , "Internal server error");
    }
}

const getProjectTasks = async (req , res)=>{

    try{
        const {projectId} = req.params;

        const project = await projectModel.findById(projectId);

        if(!project){
            return errorResponse(res , 404 , "Project not found");
        }

        const isMember = project.members.some(
            (member)=> (member.user?._id || member.user).toString() === req.user._id.toString()
        );
        if(!isMember){
            return errorResponse(res , 403 , "You are not a member of this project");
        }   
        const tasks = await taskModel.find({project : projectId})
        .populate("assignees", "name profilePicture")
        .sort({ createdAt: -1 });

        return successResponse(res , 200 , "Project tasks fetched successfully" , tasks);
    }
    catch(error){

        console.log(error);
        return errorResponse(res , 500 , "Internal server error");
    }
}

const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, status, startDate, dueDate, tags, progress } = req.body;

    const project = await projectModel.findById(projectId);

    if (!project) {
      return errorResponse(res, 404, "Project not found");
    }

    const isMember = project.members.some(
      (member) => (member.user?._id || member.user).toString() === req.user._id.toString()
    );

    if (!isMember) {
      return errorResponse(res, 403, "You are not a member of this project");
    }

    const updateData = {
      title: title || project.title,
      description: description !== undefined ? description : project.description,
      status: status || project.status,
      startDate: startDate || project.startDate,
      dueDate: dueDate || project.dueDate,
      progress: progress !== undefined ? progress : project.progress,
    };

    if (tags) {
      updateData.tags = typeof tags === "string" ? tags.split(",").map(tag => tag.trim()) : tags;
    }

    const updatedProject = await projectModel.findByIdAndUpdate(
      projectId,
      updateData,
      { new: true, runValidators: true }
    ).populate("members.user", "name profilePicture");

    return successResponse(res, 200, "Project updated successfully", updatedProject);
  } catch (error) {
    console.error("Error in Updating Project:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};

const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await projectModel.findById(projectId);

    if (!project) {
      return errorResponse(res, 404, "Project not found");
    }

    const isMember = project.members.some(
      (member) => (member.user?._id || member.user).toString() === req.user._id.toString()
    );

    if (!isMember) {
      return errorResponse(res, 403, "You are not a member of this project");
    }

    const tasks = await taskModel.find({ project: projectId });
    const taskIds = tasks.map(task => task._id);

    if (taskIds.length > 0) {
        await Comment.deleteMany({ task: { $in: taskIds } });
    }

    await taskModel.deleteMany({ project: projectId });

    await workspaceModel.findByIdAndUpdate(project.workspace, {
      $pull: { projects: projectId }, // removes the reference of project from the workspace project array and later we remove it
    });

    await projectModel.findByIdAndDelete(projectId);

    return successResponse(res, 200, "Project deleted successfully");
  } catch (error) {
    console.error("Error in Deleting Project:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};

const addProjectMember = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { memberId } = req.body;

        const project = await projectModel.findById(projectId);

        if (!project) {
            return errorResponse(res, 404, "Project not found");
        }
        const isRequesterMember = project.members.some(
            (member) => (member.user?._id || member.user).toString() === req.user._id.toString()
        );

        if (!isRequesterMember) {
            return errorResponse(res, 403, "You are not a member of this project");
        }

        const isAlreadyMember = project.members.some(
            (member) => (member.user?._id || member.user).toString() === memberId
        );

        if (isAlreadyMember) {
            return errorResponse(res, 400, "User is already a member of this project");
        }
        const workspace = await workspaceModel.findById(project.workspace);
        if (!workspace) {
             return errorResponse(res, 404, "Workspace not found");
        }

        const isWorkspaceMember = workspace.members.some(
            (member) => (member.user?._id || member.user).toString() === memberId
        );

        if (!isWorkspaceMember) {
            return errorResponse(res, 400, "User must be a member of the workspace to be added to the project");
        }
        project.members.push({ user: memberId, role: "contributor" });
        await project.save();

        const updatedProject = await projectModel.findById(projectId).populate("members.user", "name profilePicture");

        return successResponse(res, 200, "Member added successfully", updatedProject);

    } catch (error) {
        console.error("Error adding project member:", error);
        return errorResponse(res, 500, "Internal server error");
    }
}

export { createProject, getProjectDetails, getProjectTasks, updateProject, deleteProject, addProjectMember };