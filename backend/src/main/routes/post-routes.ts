import { Router } from "express";
import { adaptMiddleware } from "../adapters/express-middleware-adapter";
import { adaptRoute } from "../adapters/express-route-adapter";
import { makeAddPostController } from "../factories/controllers/posts/add-post/add-post-controller-factory";
import { makeLoadPostsController } from "../factories/controllers/posts/load-post/load-posts-controller-factory";
import { makeAuthMiddleware } from "../factories/middlewares/auth-middleware-factory";

export default (router: Router): void => {
  const userAuth = adaptMiddleware(makeAuthMiddleware());
  router.post("/posts", userAuth, adaptRoute(makeAddPostController()));
  router.get("/posts", userAuth, adaptRoute(makeLoadPostsController()));
};
