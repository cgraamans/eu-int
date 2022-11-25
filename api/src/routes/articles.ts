
  import { Router } from "express";
  import ArticleController from "../controllers/ArticleController";
  import { checkJwt } from "../middlewares/checkJwt";
  import { checkRole } from "../middlewares/checkRole";

  const router = Router();

  //Get all users
  router.get("/",ArticleController.listAll);

  // Get one user
  router.get(
    "/:id([0-9]+)",
    ArticleController.getOneById
  );

  export default router;