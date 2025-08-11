import mongoose from "mongoose";

const urlSchema= new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    percentile:{type:Number,required:true},
   branches: { type: [String], required: true },


})
export const Url=mongoose.model("CounUser",urlSchema);
export default Url;