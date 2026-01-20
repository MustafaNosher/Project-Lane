import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import projectModel from "./src/models/project.js";
import userModel from "./src/models/user.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

import workspaceModel from "./src/models/workspace.js";

const verifyProjectMembers = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URL);
      console.log("Connected to MongoDB");
  
      const projects = await projectModel.find({}).populate("members.user", "name email");
  
      for (const project of projects) {
        console.log(`\nProject: ${project.title} (ID: ${project._id})`);
        console.log(`Workspace ID: ${project.workspace}`);
        console.log("Project Members:");
        project.members.forEach(m => {
            if (m.user) {
                console.log(` - ${m.user.name} (${m.user.email}) [Role: ${m.role}]`);
            } else {
                console.log(` - [User not found] (ID: ${m.user}) [Role: ${m.role}]`);
            }
        });

        // Check workspace members
        if (project.workspace) {
            const workspace = await workspaceModel.findById(project.workspace).populate("members.user", "name email");
            if (workspace) {
                console.log("Workspace Members:");
                workspace.members.forEach(m => {
                     if (m.user) {
                        console.log(` - ${m.user.name} (${m.user.email}) [Role: ${m.role}]`);
                    } else {
                        console.log(` - [User not found] (ID: ${m.user}) [Role: ${m.role}]`);
                    }
                });
            } else {
                console.log("Workspace not found.");
            }
        }
    }

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\nDisconnected");
  }
};

verifyProjectMembers();
