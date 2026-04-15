import mongoose from "mongoose";
const pazzaReadStatusSchema = new mongoose.Schema(
  {
    _id: String,
    user: { type: String, ref: "UserModel" },
    post: { type: String, ref: "PazzaPostModel" },
    readAt: { type: Date, default: Date.now },
  },
  { collection: "pazzaReadStatus" }
);
export default pazzaReadStatusSchema;
