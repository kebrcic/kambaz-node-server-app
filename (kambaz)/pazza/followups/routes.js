import PazzaFollowupsDao from "./dao.js";
import PazzaRepliesDao from "../replies/dao.js";

export default function PazzaFollowupRoutes(app) {
  const dao = PazzaFollowupsDao();
  const repliesDao = PazzaRepliesDao();

  const findFollowupsForPost = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) return res.sendStatus(401);
    const { postId } = req.params;
    const followups = await dao.findFollowupsForPost(postId);
    res.json(followups);
  };

  const createFollowup = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) return res.sendStatus(401);
    const { postId } = req.params;
    const followup = {
      ...req.body,
      post: postId,
      author: currentUser._id,
      authorName: `${currentUser.firstName} ${currentUser.lastName}`,
    };
    const newFollowup = await dao.createFollowup(followup);
    res.json(newFollowup);
  };

  const updateFollowup = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) return res.sendStatus(401);
    const { followupId } = req.params;
    const followup = await dao.findFollowupById(followupId);
    if (!followup) return res.sendStatus(404);
    if (
      followup.author !== currentUser._id &&
      currentUser.role !== "FACULTY" &&
      currentUser.role !== "ADMIN"
    )
      return res.sendStatus(403);
    const status = await dao.updateFollowup(followupId, req.body);
    res.json(status);
  };

  const deleteFollowup = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) return res.sendStatus(401);
    const { followupId } = req.params;
    const followup = await dao.findFollowupById(followupId);
    if (!followup) return res.sendStatus(404);
    if (
      followup.author !== currentUser._id &&
      currentUser.role !== "FACULTY" &&
      currentUser.role !== "ADMIN"
    )
      return res.sendStatus(403);
    await repliesDao.deleteRepliesForFollowup(followupId);
    await dao.deleteFollowup(followupId);
    res.json({ status: "ok" });
  };

  app.get("/api/courses/:cid/pazza/posts/:postId/followups", findFollowupsForPost);
  app.post("/api/courses/:cid/pazza/posts/:postId/followups", createFollowup);
  app.put("/api/courses/:cid/pazza/followups/:followupId", updateFollowup);
  app.delete("/api/courses/:cid/pazza/followups/:followupId", deleteFollowup);
}
