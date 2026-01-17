import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    profilePicture: { type: String }, //kept optional as of now

    stripeCustomerId: {
      type: String,
    },
    stripeSessionId: {
      type: String,
    },
    plan: {
      type: String,
      enum: ["free", "pro"],
      default: "free",
    },

    isPaid: {
      type: Boolean,
      default: false,
    },
},
  { timestamps: true }
)

export default mongoose.model("User", userSchema);
