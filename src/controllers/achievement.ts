import { NextFunction, Response } from "express";
import { customRequest } from "../types/customDefinition";
import { getAchievementsService, createAchievementService, updateAchievementService, deleteAchievementService } from "../services/achievementService";

export const getAchievements = async (
    req: customRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const achievements = await getAchievementsService();
        return res.status(200).json({
            data: achievements,
            error: false,
        });
    } catch (err) {
        next(err);
    }
};

export const createAchievement = async (
    req: customRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const payload = req.body;
        const achievement = await createAchievementService(payload);
        return res.status(200).json({
            data: achievement,
            error: false,
            msg: "Achievement created successfully",
        });
    } catch (err) {
        next(err);
    }
};

export const updateAchievement = async (
    req: customRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        const updatedAchievement = await updateAchievementService(id, payload);

        return res.status(200).json({
            data: updatedAchievement,
            error: false,
            msg: "Achievement updated successfully",
        });
    } catch (err) {
        next(err);
    }
};

export const deleteAchievement = async (
    req: customRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        await deleteAchievementService(id);
        return res.status(200).json({
            error: false,
            msg: "Achievement deleted successfully",
        });
    } catch (err) {
        next(err);
    }
};
