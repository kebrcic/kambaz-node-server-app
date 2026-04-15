import mongoose from "mongoose";
import schema from "./schema.js";
const model = mongoose.model("PazzaFollowupModel", schema);
export default model;
