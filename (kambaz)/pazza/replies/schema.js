import mongoose from "mongoose";
const pazzaReplySchema = new mongoose.Schema(
  {
    _id: String,
    followup: { type: String, ref: "PazzaFollowupModel" },
    content: { type: String, required: true },
    author: { type: String, ref: "UserModel" },
    authorName: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "pazzaReplies" }
);
export default pazzaReplySchema;
