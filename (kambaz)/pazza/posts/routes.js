import PazzaPostsDao from "./dao.js";
import PazzaAnswersDao from "../answers/dao.js";
import PazzaFollowupsDao from "../followups/dao.js";
import PazzaRepliesDao from "../replies/dao.js";
import PazzaReadStatusDao from "../readStatus/dao.js";
import EnrollmentsDao from "../../enrollments/dao.js";

export default function PazzaPostRoutes(app) {
  const postsDao = PazzaPostsDao();
  const answersDao = PazzaAnswersDao();
  const followupsDao = PazzaFollowupsDao();
  const repliesDao = PazzaRepliesDao();
  const readStatusDao = PazzaReadStatusDao();
  const enrollmentsDao = EnrollmentsDao();

  const findPostsForCourse = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) return res.sendStatus(401);
    const { cid } = req.params;
    const { folder, search } = req.query;

    let posts = await postsDao.findPostsForCourse(cid, { folder, search });

    // Filter "Individual" posts for non-faculty users
    if (currentUser.role !== "FACULTY" && currentUser.role !== "ADMIN") {
      posts = posts.filter(
        (p) =>
          p.postTo === "Entire Class" ||
          p.author === currentUser._id ||
          (p.visibleTo && p.visibleTo.includes(currentUser._id))
      );
    }

    // Attach read status and view count
    const postIds = posts.map((p) => p._id);
    const readStatuses = await readStatusDao.findReadPostsForUser(
      currentUser._id,
      postIds
    );
    const readPostIds = new Set(readStatuses.map((r) => r.post));

    const viewCounts = await readStatusDao.countViewersForPosts(postIds);
    const viewCountMap = new Map(viewCounts.map((v) => [v._id, v.count]));

    const postsWithStatus = posts.map((p) => ({
      ...p.toObject(),
      isRead: readPostIds.has(p._id),
      viewCount: viewCountMap.get(p._id) || 0,
    }));

    res.json(postsWithStatus);
  };

  const findPostById = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) return res.sendStatus(401);
    const { postId } = req.params;
    const post = await postsDao.findPostById(postId);
    if (!post) return res.sendStatus(404);

    // Visibility check for Individual posts
    if (
      post.postTo === "Individual" &&
      currentUser.role !== "FACULTY" &&
      currentUser.role !== "ADMIN" &&
      post.author !== currentUser._id &&
      !(post.visibleTo && post.visibleTo.includes(currentUser._id))
    ) {
      return res.sendStatus(403);
    }

    // Mark as read
    await readStatusDao.markAsRead(currentUser._id, postId);

    const viewCount = await readStatusDao.countViewersForPost(postId);
    res.json({ ...post.toObject(), viewCount });
  };

  const createPost = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) return res.sendStatus(401);
    const { cid } = req.params;

    if (!req.body.folders || !Array.isArray(req.body.folders) || req.body.folders.length === 0) {
      return res.status(400).json({ message: "At least one folder is required" });
    }

    const post = {
      ...req.body,
      course: cid,
      author: currentUser._id,
      authorName: `${currentUser.firstName} ${currentUser.lastName}`,
      authorRole: currentUser.role,
    };
    try {
      const newPost = await postsDao.createPost(post);
      res.json(newPost);
    } catch (err) {
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
      throw err;
    }
  };

  const updatePost = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) return res.sendStatus(401);
    const { postId } = req.params;
    const post = await postsDao.findPostById(postId);
    if (!post) return res.sendStatus(404);
    if (
      post.author !== currentUser._id &&
      currentUser.role !== "FACULTY" &&
      currentUser.role !== "ADMIN"
    )
      return res.sendStatus(403);

    const status = await postsDao.updatePost(postId, req.body);
    res.json(status);
  };

  const deletePost = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) return res.sendStatus(401);
    const { postId } = req.params;
    const post = await postsDao.findPostById(postId);
    if (!post) return res.sendStatus(404);
    if (
      post.author !== currentUser._id &&
      currentUser.role !== "FACULTY" &&
      currentUser.role !== "ADMIN"
    )
      return res.sendStatus(403);

    // Cascade delete: replies -> followups -> answers -> readStatus -> post
    const followups = await followupsDao.findFollowupsForPost(postId);
    for (const f of followups) {
      await repliesDao.deleteRepliesForFollowup(f._id);
    }
    await followupsDao.deleteFollowupsForPost(postId);
    await answersDao.deleteAnswersForPost(postId);
    await readStatusDao.deleteReadStatusForPost(postId);
    await postsDao.deletePost(postId);

    res.json({ status: "ok" });
  };

  const getStats = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) return res.sendStatus(401);
    const { cid } = req.params;

    const allPosts = await postsDao.findPostsForCourse(cid);
    const postIds = allPosts.map((p) => p._id);
    const totalPosts = allPosts.length;

    // Unread count
    const unreadCount = await readStatusDao.countUnreadForUser(
      currentUser._id,
      postIds
    );

    // Unanswered questions
    const questionPosts = allPosts.filter((p) => p.type === "Question");
    let unansweredCount = 0;
    for (const q of questionPosts) {
      const answers = await answersDao.findAnswersForPost(q._id);
      if (answers.length === 0) unansweredCount++;
    }

    // Answer counts by type
    const answerCounts = await answersDao.countAnswersByTypeForCourse(cid);
    const instructorResponseCount =
      answerCounts.find((a) => a._id === "instructor")?.count || 0;
    const studentResponseCount =
      answerCounts.find((a) => a._id === "student")?.count || 0;

    // Enrolled student count
    const enrolledUsers = await enrollmentsDao.findUsersForCourse(cid);
    const enrolledStudentCount = enrolledUsers.filter(
      (u) => u.role === "STUDENT"
    ).length;

    res.json({
      unreadCount,
      unansweredCount,
      totalPosts,
      instructorResponseCount,
      studentResponseCount,
      enrolledStudentCount,
    });
  };

  app.get("/api/courses/:cid/pazza/posts", findPostsForCourse);
  app.get("/api/courses/:cid/pazza/posts/:postId", findPostById);
  app.post("/api/courses/:cid/pazza/posts", createPost);
  app.put("/api/courses/:cid/pazza/posts/:postId", updatePost);
  app.delete("/api/courses/:cid/pazza/posts/:postId", deletePost);
  app.get("/api/courses/:cid/pazza/stats", getStats);
}
