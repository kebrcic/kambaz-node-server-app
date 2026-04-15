import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function PazzaAnswersDao() {
  function findAnswersForPost(postId) {
    return model.find({ post: postId }).sort({ createdAt: 1 });
  }

  function findAnswerById(answerId) {
    return model.findById(answerId);
  }

  function createAnswer(answer) {
    return model.create({
      ...answer,
      _id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  function updateAnswer(answerId, updates) {
    return model.updateOne(
      { _id: answerId },
      { $set: { ...updates, updatedAt: new Date() } }
    );
  }

  function deleteAnswer(answerId) {
    return model.deleteOne({ _id: answerId });
  }

  function deleteAnswersForPost(postId) {
    return model.deleteMany({ post: postId });
  }

  function countAnswersByTypeForCourse(courseId) {
    return model.aggregate([
      {
        $lookup: {
          from: "pazzaPosts",
          localField: "post",
          foreignField: "_id",
          as: "postDoc",
        },
      },
      { $unwind: "$postDoc" },
      { $match: { "postDoc.course": courseId } },
      { $group: { _id: "$answerType", count: { $sum: 1 } } },
    ]);
  }

  return {
    findAnswersForPost,
    findAnswerById,
    createAnswer,
    updateAnswer,
    deleteAnswer,
    deleteAnswersForPost,
    countAnswersByTypeForCourse,
  };
}
