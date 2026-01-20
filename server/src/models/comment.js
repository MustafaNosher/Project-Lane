import mongoose from "mongoose";

const commentSchema = mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    // A comment belongs to a specific task
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    // A comment is created by a specific user
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // mentions are the users mentioned in the comment
    mentions: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        offset: {
          type: Number,
        },
        length: {
          type: Number,
        },
      },
    ],
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;