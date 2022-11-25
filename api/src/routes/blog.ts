
  import { Router } from "express";
  import BlogController from "../controllers/BlogController";
  import { checkJwt } from "../middlewares/checkJwt";
  import { checkRole } from "../middlewares/checkRole";

  const router = Router();

  //Get all users
  router.get("/",BlogController.listAll);

  // Get one user
  router.get(
    "/:id([0-9]+)",
    BlogController.getOneById
  );

  export default router;