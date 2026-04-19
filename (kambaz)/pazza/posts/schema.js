import mongoose from "mongoose";
const pazzaPostSchema = new mongoose.Schema(
  {
    _id: String,
    course: { type: String, ref: "CourseModel" },
    type: { type: String, enum: ["Question", "Note"], required: true },
    summary: { type: String, required: true, maxlength: 100 },
    details: { type: String, required: true },
    postTo: {
      type: String,
      enum: ["Entire Class", "Individual"],
      default: "Entire Class",
    },
    visibleTo: [{ type: String, ref: "UserModel" }],
    folders: [String],
    author: { type: String, ref: "UserModel" },
    authorName: String,
    authorRole: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "pazzaPosts" }
);
export default pazzaPostSchema;
