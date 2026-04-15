import PazzaFoldersDao from "./dao.js";

export default function PazzaFolderRoutes(app) {
  const dao = PazzaFoldersDao();

  const findFoldersForCourse = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) return res.sendStatus(401);
    const { cid } = req.params;
    const folders = await dao.findFoldersForCourse(cid);
    res.json(folders);
  };

  const createFolder = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) return res.sendStatus(401);
    if (currentUser.role !== "FACULTY" && currentUser.role !== "ADMIN")
      return res.sendStatus(403);
    const { cid } = req.params;
    const folder = { ...req.body, course: cid };
    const newFolder = await dao.createFolder(folder);
    res.json(newFolder);
  };

  const createDefaultFolders = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) return res.sendStatus(401);
    if (currentUser.role !== "FACULTY" && currentUser.role !== "ADMIN")
      return res.sendStatus(403);
    const { cid } = req.params;
    const folders = await dao.createDefaultFolders(cid);
    res.json(folders);
  };

  const updateFolder = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) return res.sendStatus(401);
    if (currentUser.role !== "FACULTY" && currentUser.role !== "ADMIN")
      return res.sendStatus(403);
    const { folderId } = req.params;
    const status = await dao.updateFolder(folderId, req.body);
    res.json(status);
  };

  const deleteFolder = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) return res.sendStatus(401);
    if (currentUser.role !== "FACULTY" && currentUser.role !== "ADMIN")
      return res.sendStatus(403);
    const { folderId } = req.params;
    const status = await dao.deleteFolder(folderId);
    res.json(status);
  };

  app.get("/api/courses/:cid/pazza/folders", findFoldersForCourse);
  app.post("/api/courses/:cid/pazza/folders", createFolder);
  app.post("/api/courses/:cid/pazza/folders/defaults", createDefaultFolders);
  app.put("/api/courses/:cid/pazza/folders/:folderId", updateFolder);
  app.delete("/api/courses/:cid/pazza/folders/:folderId", deleteFolder);
}
