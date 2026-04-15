import mongoose from "mongoose";
const pazzaFollowupSchema = new mongoose.Schema(
  {
    _id: String,
    post: { type: String, ref: "PazzaPostModel" },
    content: { type: String, required: true },
    author: { type: String, ref: "UserModel" },
    authorName: String,
    resolved: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "pazzaFollowups" }
);
export default pazzaFollowupSchema;
