import Player from "../models/Player";
import Game from "../models/Game";
import Achievement from "../models/Achievement";
import { encryptSync } from "../util/encrypt";
import { createAchievementService } from "./achievementService";

export const getPlayersService = async ({ gameId }: { gameId?: number }) => {
    const players = await Player.findAll({
        include: [
            {
                model: Game,
                ...(gameId && {
                    where: { id: gameId }
                }),
                through: { attributes: [] }
            },
            {
                model: Achievement,
                as: "achievements"
            }
        ]
    });
    return players;
};


export const playerGetByIdService = async ({ playerId }: { playerId: number }) => {
    const player = await Player.findByPk(playerId, {
        include: [
            {
                model: Game,
                through: { attributes: [] } 
            },
            {
                model: Achievement,
                as: "achievements"
            }
        ]
    });

    if (!player) {
        throw new Error(`Player with id ${playerId} not found`);
    }

    return player;
};


export const createPlayerService = async (
    playerData: any,
    gameIds: number[],
    achievements: any[] 
) => {
    playerData.password = encryptSync(playerData.password);
    const player = await Player.create(playerData);

    const games = await Game.findAll({
        where: {
            id: gameIds,
        },
    });
    await player.addGames(games);
    const achievementPromises = achievements.map(async (achievement) => {
        const { id,...values }=achievement;
        const payload = {...values, playerId:player.id};
        return await createAchievementService(payload);
    });
    await Promise.all(achievementPromises);
    return player; 
};


// Update player details
export const updatePlayerService = async (id: string, payload: any) => {
    const player = await Player.findByPk(id);
    if (!player) {
        throw new Error("Player not found");
    }
    return Player.update(payload, {
        where: { id: id },
    });
};

// Delete a player
export const deletePlayerService = async (id: string) => {
    const player = await Player.findByPk(id);
    if (!player) {
        throw new Error("Player not found");
    }
    await player.destroy();
    return;
};


// Add an achievement to a player (One-to-Many relationship)
export const addAchievementToPlayerService = async (playerId: string, achievementData: any) => {
    const player = await Player.findByPk(playerId);

    if (!player) {
        throw new Error("Player not found");
    }

    // Create and associate the achievement with the player
    const achievement = await Achievement.create({
        ...achievementData,
        playerId: player.id, // Associate achievement with player
    });

    return achievement;
};

