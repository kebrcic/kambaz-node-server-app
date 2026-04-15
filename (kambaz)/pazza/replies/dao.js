import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function PazzaRepliesDao() {
  function findRepliesForFollowup(followupId) {
    return model.find({ followup: followupId }).sort({ createdAt: 1 });
  }

  function findReplyById(replyId) {
    return model.findById(replyId);
  }

  function createReply(reply) {
    return model.create({
      ...reply,
      _id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  function updateReply(replyId, updates) {
    return model.updateOne(
      { _id: replyId },
      { $set: { ...updates, updatedAt: new Date() } }
    );
  }

  function deleteReply(replyId) {
    return model.deleteOne({ _id: replyId });
  }

  function deleteRepliesForFollowup(followupId) {
    return model.deleteMany({ followup: followupId });
  }

  return {
    findRepliesForFollowup,
    findReplyById,
    createReply,
    updateReply,
    deleteReply,
    deleteRepliesForFollowup,
  };
}
