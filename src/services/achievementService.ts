import Achievement from "../models/Achievement";

export const getAchievementsService = async () => {
    const achievements = await Achievement.findAll();
    return achievements;
};

export const createAchievementService = async (payload: any) => {
    const achievement = await Achievement.create(payload);
    return achievement;
};

export const updateAchievementService = async (id: string, payload: any) => {
    const achievement = await Achievement.findByPk(id);
    if (!achievement) {
        throw new Error("Achievement not found");
    }
    return await achievement.update(payload);
};

export const deleteAchievementService = async (id: string) => {
    const achievement = await Achievement.findByPk(id);
    if (!achievement) {
        throw new Error("Achievement not found");
    }
    await achievement.destroy();
    return;
};
