import mongoose from "mongoose";
const pazzaFolderSchema = new mongoose.Schema(
  {
    _id: String,
    course: { type: String, ref: "CourseModel" },
    name: { type: String, required: true },
  },
  { collection: "pazzaFolders" }
);
export default pazzaFolderSchema;
