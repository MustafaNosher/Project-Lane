import projectModel from "../models/project.js";
import workspaceModel from "../models/workspace.js"
import taskModel from "../models/task.js";
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
            (member)=> member.user.toString() === req.user._id.toString()
        );

        if(!isMember){
            return errorResponse(res , 403 , "You are not a member of this workspace");
        } 
        //tags is an array of strings
        const tagSeperated = tags ? tags.split(",").map(tag => tag.trim()) : [];

        const projectMembers = [ { user: req.user._id, role: "manager" }, ...(members || []) ];

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
        return successResponse(res , 201 , "Project created successfully" , project);

    }catch(error){
        console.log(error);
        return errorResponse(res , 500 , "Internal server error");
    }
}

const getProjectDetails = async (req , res)=>{
    try{
        const {projectId} = req.params;

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
            (member)=> member.user.toString() === req.user._id.toString()
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
      (member) => member.user.toString() === req.user._id.toString()
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
    );

    return successResponse(res, 200, "Project updated successfully", updatedProject);
  } catch (error) {
    console.error("Error in Updating Project:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};

export { createProject, getProjectDetails, getProjectTasks, updateProject };