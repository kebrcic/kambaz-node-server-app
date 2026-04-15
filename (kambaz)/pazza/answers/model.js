import mongoose from "mongoose";
import schema from "./schema.js";
const model = mongoose.model("PazzaAnswerModel", schema);
export default model;
