import mongoose from "mongoose";
const pazzaAnswerSchema = new mongoose.Schema(
  {
    _id: String,
    post: { type: String, ref: "PazzaPostModel" },
    answerType: { type: String, enum: ["student", "instructor"], required: true },
    content: { type: String, required: true },
    author: { type: String, ref: "UserModel" },
    authorName: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "pazzaAnswers" }
);
export default pazzaAnswerSchema;
