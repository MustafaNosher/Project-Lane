import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },

    description: { type: String, trim: true , default:""}, //Optional Description

    // to which project the task belongs to
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    status: {
      type: String,
      enum: ["To Do", "In Progress", "Review", "Done"],
      default: "To Do",
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "High",
    },

    assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    //watchers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dueDate: { type: Date },

    completedAt: { type: Date },

    estimatedHours: { type: Number, min: 0 },

    //actualHours: { type: Number, min: 0 },

    tags: [{ type: String }],
    // tasks can have multiple subtasks in them 
    subtasks: [
      {
        title: {
          type: String,
          required: true,
        },
        completed: {
          type: Boolean,
          default: false,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }], // user can comment on tasks

    //user can attach files/attachments to tasks
    attachments: [
      {
        fileName: { type: String, required: true },
        fileUrl: { type: String, required: true },
        fileType: { type: String },
        fileSize: { type: Number },
        uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    //user who created the task
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;