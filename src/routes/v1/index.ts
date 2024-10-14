import { Router } from "express";

import authRouter from "./authRoute";
import docsRouter from "./docsRoute";
import userRouter from "./userRoutes";
import gameRouter from "./gameRoute";
import achievementRouter from "./achievementRoute";
import playerRouter from "./playerRoute";

const appRouter = Router();

// all routes
const appRoutes = [
  {
    path: "/auth",
    router: authRouter,
  },
  {
    path: "/user",
    router: userRouter,
  },
  {
    path: "/game",
    router: gameRouter,
  },
  {
    path: "/player",
    router: playerRouter,
  },
  {
    path: "/achievement",
    router: achievementRouter,
  },
  {
    path: "/docs",
    router: docsRouter,
  },
];

appRoutes.forEach(route => {
  appRouter.use(route.path, route.router);
});

export default appRouter;
