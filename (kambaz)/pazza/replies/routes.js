import PazzaRepliesDao from "./dao.js";

export default function PazzaReplyRoutes(app) {
  const dao = PazzaRepliesDao();

  const findRepliesForFollowup = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) return res.sendStatus(401);
    const { fid } = req.params;
    const replies = await dao.findRepliesForFollowup(fid);
    res.json(replies);
  };

  const createReply = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) return res.sendStatus(401);
    const { fid } = req.params;
    const reply = {
      ...req.body,
      followup: fid,
      author: currentUser._id,
      authorName: `${currentUser.firstName} ${currentUser.lastName}`,
    };
    const newReply = await dao.createReply(reply);
    res.json(newReply);
  };

  const updateReply = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) return res.sendStatus(401);
    const { replyId } = req.params;
    const reply = await dao.findReplyById(replyId);
    if (!reply) return res.sendStatus(404);
    if (
      reply.author !== currentUser._id &&
      currentUser.role !== "FACULTY" &&
      currentUser.role !== "ADMIN"
    )
      return res.sendStatus(403);
    const status = await dao.updateReply(replyId, req.body);
    res.json(status);
  };

  const deleteReply = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) return res.sendStatus(401);
    const { replyId } = req.params;
    const reply = await dao.findReplyById(replyId);
    if (!reply) return res.sendStatus(404);
    if (
      reply.author !== currentUser._id &&
      currentUser.role !== "FACULTY" &&
      currentUser.role !== "ADMIN"
    )
      return res.sendStatus(403);
    const status = await dao.deleteReply(replyId);
    res.json(status);
  };

  app.get("/api/courses/:cid/pazza/followups/:fid/replies", findRepliesForFollowup);
  app.post("/api/courses/:cid/pazza/followups/:fid/replies", createReply);
  app.put("/api/courses/:cid/pazza/replies/:replyId", updateReply);
  app.delete("/api/courses/:cid/pazza/replies/:replyId", deleteReply);
}
