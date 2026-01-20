import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: { type: String, trim: true },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    }, // A project must belong to a workspace
    status: {
      type: String,
      enum: ["Planning", "In Progress", "Need Info", "Completed", "Cancelled"],
      default: "Planning",
    },
    startDate: { type: Date },
    dueDate: { type: Date },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }], // A project has multiple tasks in it
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["manager", "contributor"],
          default: "contributor",
        },
      },
    ],
    tags: [{ type: String }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;