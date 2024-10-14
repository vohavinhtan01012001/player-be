import { Router } from "express";
import { createAchievement, deleteAchievement, getAchievements, updateAchievement } from "../../controllers/achievement";
import { isAdmin } from "../../middleware";

const achievementRouter = Router();

achievementRouter.get("/", getAchievements);

achievementRouter.post("/add-achievement", isAdmin, createAchievement);

achievementRouter.put("/update-achievement/:id", isAdmin, updateAchievement);

achievementRouter.delete("/delete-achievement/:id", isAdmin, deleteAchievement);

export default achievementRouter;
