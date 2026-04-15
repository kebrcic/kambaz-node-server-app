import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function PazzaFollowupsDao() {
  function findFollowupsForPost(postId) {
    return model.find({ post: postId }).sort({ createdAt: 1 });
  }

  function findFollowupById(followupId) {
    return model.findById(followupId);
  }

  function createFollowup(followup) {
    return model.create({
      ...followup,
      _id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  function updateFollowup(followupId, updates) {
    return model.updateOne(
      { _id: followupId },
      { $set: { ...updates, updatedAt: new Date() } }
    );
  }

  function deleteFollowup(followupId) {
    return model.deleteOne({ _id: followupId });
  }

  function deleteFollowupsForPost(postId) {
    return model.deleteMany({ post: postId });
  }

  return {
    findFollowupsForPost,
    findFollowupById,
    createFollowup,
    updateFollowup,
    deleteFollowup,
    deleteFollowupsForPost,
  };
}
