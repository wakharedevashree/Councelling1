import mongoose from "mongoose";



//create a Schema

const LoginSchema= new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    percentile: { type: Number, required: true },
    branches: { type: [String], required: true },
});


const  collection = new mongoose.model("users",LoginSchema);

export default collection;