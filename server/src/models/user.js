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
},

{ timestamps: true }
)

export default mongoose.model("User", userSchema);
