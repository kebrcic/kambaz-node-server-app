import PazzaAnswersDao from "./dao.js";
import PazzaPostsDao from "../posts/dao.js";

export default function PazzaAnswerRoutes(app) {
  const dao = PazzaAnswersDao();
  const postsDao = PazzaPostsDao();

  const findAnswersForPost = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) return res.sendStatus(401);
    const { postId } = req.params;
    const answers = await dao.findAnswersForPost(postId);
    res.json(answers);
  };

  const createAnswer = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) return res.sendStatus(401);
    const { postId } = req.params;

    const post = await postsDao.findPostById(postId);
    if (!post) return res.sendStatus(404);
    if (post.type !== "Question") {
      return res.status(400).json({ message: "Answers can only be added to Question posts" });
    }

    let answerType;
    if (currentUser.role === "FACULTY" || currentUser.role === "ADMIN") {
      answerType = "instructor";
    } else {
      answerType = "student";
    }

    const answer = {
      ...req.body,
      answerType,
      post: postId,
      author: currentUser._id,
      authorName: `${currentUser.firstName} ${currentUser.lastName}`,
    };
    const newAnswer = await dao.createAnswer(answer);
    res.json(newAnswer);
  };

  const updateAnswer = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) return res.sendStatus(401);
    const { answerId } = req.params;
    const answer = await dao.findAnswerById(answerId);
    if (!answer) return res.sendStatus(404);
    if (
      answer.author !== currentUser._id &&
      currentUser.role !== "FACULTY" &&
      currentUser.role !== "ADMIN"
    )
      return res.sendStatus(403);
    const status = await dao.updateAnswer(answerId, req.body);
    res.json(status);
  };

  const deleteAnswer = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) return res.sendStatus(401);
    const { answerId } = req.params;
    const answer = await dao.findAnswerById(answerId);
    if (!answer) return res.sendStatus(404);
    if (
      answer.author !== currentUser._id &&
      currentUser.role !== "FACULTY" &&
      currentUser.role !== "ADMIN"
    )
      return res.sendStatus(403);
    const status = await dao.deleteAnswer(answerId);
    res.json(status);
  };

  app.get("/api/courses/:cid/pazza/posts/:postId/answers", findAnswersForPost);
  app.post("/api/courses/:cid/pazza/posts/:postId/answers", createAnswer);
  app.put("/api/courses/:cid/pazza/answers/:answerId", updateAnswer);
  app.delete("/api/courses/:cid/pazza/answers/:answerId", deleteAnswer);
}
