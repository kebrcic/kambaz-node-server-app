import model from "./model.js";

export default function PazzaReadStatusDao() {
  function markAsRead(userId, postId) {
    return model.findOneAndUpdate(
      { user: userId, post: postId },
      { _id: `${userId}-${postId}`, user: userId, post: postId, readAt: new Date() },
      { upsert: true, new: true }
    );
  }

  function findReadPostsForUser(userId, postIds) {
    return model.find({ user: userId, post: { $in: postIds } });
  }

  async function countUnreadForUser(userId, postIds) {
    if (postIds.length === 0) return 0;
    const readCount = await model.countDocuments({
      user: userId,
      post: { $in: postIds },
    });
    return postIds.length - readCount;
  }

  function deleteReadStatusForPost(postId) {
    return model.deleteMany({ post: postId });
  }

  function countViewersForPost(postId) {
    return model.countDocuments({ post: postId });
  }

  function countViewersForPosts(postIds) {
    return model.aggregate([
      { $match: { post: { $in: postIds } } },
      { $group: { _id: "$post", count: { $sum: 1 } } },
    ]);
  }

  return {
    markAsRead,
    findReadPostsForUser,
    countUnreadForUser,
    deleteReadStatusForPost,
    countViewersForPost,
    countViewersForPosts,
  };
}
