import { DataTypes, Model, Optional } from "sequelize";
import sequelizeConnection from "../db/connection";
import Game from "./Game";
import Achievement from "./Achievement";

interface PlayerAttributes {
    id: number;
    name: string;
    description?: string;
    email: string;
    password: string;
    images?: string[]; 
    avatar?: string; 
    joinDate?: Date;
    created_at?: Date;
    status: number;
}

interface PlayerCreationAttributes extends Optional<PlayerAttributes, "id"> {}

class Player extends Model<PlayerAttributes, PlayerCreationAttributes> implements PlayerAttributes {
    public id!: number;
    public name!: string;
    public description?: string;
    public email!: string;
    public password!: string;
    public images?: string[];
    public avatar?: string; 
    public joinDate?: Date;
    public status!: number; 

    // Timestamps
    public readonly created_at!: Date;

    // Define associations inside the Player model
    public static associate() {
        // Many-to-Many: Player <--> Game
        Player.belongsToMany(Game, { through: "PlayerGames", foreignKey: "playerId" });
        Game.belongsToMany(Player, { through: "PlayerGames", foreignKey: "gameId" });

        // One-to-Many: Player --> Achievement
        Player.hasMany(Achievement, { foreignKey: "playerId", as: "achievements" });
        Achievement.belongsTo(Player, { foreignKey: "playerId" });
    }

    // Include methods for managing Game associations
    public addGames!: (game: Game | Game[], options?: any) => Promise<void>;
    public getGames!: (options?: any) => Promise<Game[]>;
    public removeGame!: (game: Game | Game[], options?: any) => Promise<void>;

    // Include methods for managing Achievement associations
    public addAchievements!: (achievement: Achievement | Achievement[], options?: any) => Promise<void>;
    public getAchievements!: (options?: any) => Promise<Achievement[]>;
    public removeAchievement!: (achievement: Achievement | Achievement[], options?: any) => Promise<void>;
}

Player.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: { 
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        images: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        avatar: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        joinDate: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW, 
        },
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
        },
    },
    {
        sequelize: sequelizeConnection,
        tableName: "players",
        createdAt: "created_at",
    }
);

Player.associate();

export default Player;
