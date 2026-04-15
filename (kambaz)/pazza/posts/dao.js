import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function PazzaPostsDao() {
  function findPostsForCourse(courseId, { folder, search } = {}) {
    const query = { course: courseId };
    if (folder) {
      query.folders = folder;
    }
    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [
        { summary: { $regex: regex } },
        { details: { $regex: regex } },
      ];
    }
    return model.find(query).sort({ createdAt: -1 });
  }

  function findPostById(postId) {
    return model.findById(postId);
  }

  function createPost(post) {
    return model.create({
      ...post,
      _id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  function updatePost(postId, updates) {
    return model.updateOne(
      { _id: postId },
      { $set: { ...updates, updatedAt: new Date() } }
    );
  }

  function deletePost(postId) {
    return model.deleteOne({ _id: postId });
  }

  function countPostsForCourse(courseId) {
    return model.countDocuments({ course: courseId });
  }

  function findQuestionPostsForCourse(courseId) {
    return model.find({ course: courseId, type: "Question" });
  }

  return {
    findPostsForCourse,
    findPostById,
    createPost,
    updatePost,
    deletePost,
    countPostsForCourse,
    findQuestionPostsForCourse,
  };
}
