import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function PazzaFoldersDao() {
  const DEFAULT_FOLDERS = [
    "hw1", "hw2", "hw3", "hw4", "hw5",
    "hw6", "hw7", "hw8", "hw9", "hw10",
    "project", "exam", "logistics", "other", "office_hours",
  ];

  function findFoldersForCourse(courseId) {
    return model.find({ course: courseId });
  }

  function createFolder(folder) {
    return model.create({ ...folder, _id: uuidv4() });
  }

  function createDefaultFolders(courseId) {
    const folders = DEFAULT_FOLDERS.map((name) => ({
      _id: uuidv4(),
      course: courseId,
      name,
    }));
    return model.insertMany(folders);
  }

  function updateFolder(folderId, updates) {
    return model.updateOne({ _id: folderId }, { $set: updates });
  }

  function deleteFolder(folderId) {
    return model.deleteOne({ _id: folderId });
  }

  function deleteFoldersForCourse(courseId) {
    return model.deleteMany({ course: courseId });
  }

  return {
    findFoldersForCourse,
    createFolder,
    createDefaultFolders,
    updateFolder,
    deleteFolder,
    deleteFoldersForCourse,
  };
}
