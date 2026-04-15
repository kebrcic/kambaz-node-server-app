import PazzaFolderRoutes from "./folders/routes.js";
import PazzaPostRoutes from "./posts/routes.js";
import PazzaAnswerRoutes from "./answers/routes.js";
import PazzaFollowupRoutes from "./followups/routes.js";
import PazzaReplyRoutes from "./replies/routes.js";

export default function PazzaRoutes(app) {
  PazzaFolderRoutes(app);
  PazzaPostRoutes(app);
  PazzaAnswerRoutes(app);
  PazzaFollowupRoutes(app);
  PazzaReplyRoutes(app);
}
