import { NextFunction, Request, Response } from "express";
import { createPlayerService, deletePlayerService, getPlayersService, playerGetByIdService, updatePlayerService } from "../services/playerService";
import { customRequest } from "customDefinition";
import { v2 as cloudinary } from "cloudinary";

export const getPlayers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const gameId = parseInt(req.params.gameId);
        const players = await getPlayersService({gameId});
        return res.status(200).json({
            data: players,
            error: false,
        });
    } catch (err) {
        next(err);
    }
};

export const getPlayerById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const playerId = parseInt(req.params.playerId); 
        if (isNaN(playerId)) {
            return res.status(400).json({
                message: "Invalid playerId",
                error: true,
            });
        }

        const player = await playerGetByIdService({ playerId });

        return res.status(200).json({
            data: player,
            error: false,
        });
    } catch (err) {
        next(err);
    }
};

export const createPlayer = async (
    req: customRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const payload = req.body;
        const files: any = req.files;
        console.log(files["images[]"]);
        // Upload avatar if provided
        if (files && files.avatar && files.avatar.length > 0) {
            const avatar = files.avatar[0];
            const avatarUrl = await new Promise<string>((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {
                        folder: "player/avatars",
                    },
                    (error: any, result: any) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result.secure_url);
                        }
                    }
                ).end(avatar.buffer);
            });
            payload.avatar = avatarUrl;
        } else {
            return res.status(400).json({
                error: true,
                msg: "No avatar provided",
            });
        }

        // Upload images if provided
        if (files && files["images[]"] && files["images[]"].length > 0) {
            const imagePromises = files["images[]"].map((image: any) => {
                return new Promise<string>((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                        {
                            folder: "player/images",
                        },
                        (error: any, result: any) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(result.secure_url);
                            }
                        }
                    ).end(image.buffer);
                });
            });

            const imagesUrls = await Promise.all(imagePromises);
            payload.images = imagesUrls;
        } 

        // Ensure gameIds and achievements are included in the payload
        const gameIds: number[] = payload.games || []; // Default to an empty array if not provided
        const achievements = payload.achievements || []; // Default to an empty array if not provided
        console.log(achievements);
        // Create the new player using a service function
        const newPlayer = await createPlayerService(payload, gameIds, achievements);

        return res.status(201).json({
            data: newPlayer,
            error: false,
            msg: "Player created successfully",
        });
    } catch (err) {
        console.error("Error creating player:", err);
        next(err);
    }
};


export const updatePlayer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        const files: any = req.files;

        if (files && files.avatar && files.avatar.length > 0) {
            const avatar = files.avatar[0];
            const avatarUrl = await new Promise<string>((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {
                        folder: "player/avatars",
                    },
                    (error: any, result: any) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result.secure_url);
                        }
                    }
                ).end(avatar.buffer);
            });
            payload.avatar = avatarUrl; 
        }

        if (files && files["images[]"] && files["images[]"].length > 0) {
            const imagePromises = files["images[]"].map((image: any) => {
                return new Promise<string>((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                        {
                            folder: "player/images",
                        },
                        (error: any, result: any) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(result.secure_url);
                            }
                        }
                    ).end(image.buffer);
                });
            });

            const imagesUrls = await Promise.all(imagePromises);
            payload.images = imagesUrls; 
        }

        const updatedPlayer = await updatePlayerService(id, payload);

        return res.status(200).json({
            data: updatedPlayer,
            error: false,
            msg: "Player updated successfully",
        });
    } catch (err) {
        next(err);
    }
};

export const deletePlayer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await deletePlayerService(id);

        return res.status(200).json({
            error: false,
            msg: "Player deleted successfully",
        });
    } catch (err) {
        next(err);
    }
};

