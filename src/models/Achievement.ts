import { DataTypes, Model } from "sequelize";
import sequelizeConnection from "../db/connection";

class Achievement extends Model {
  public id!: number;
  public title!: string;
  public dateAchieved!: Date; 

  public playerId!: number; 

  // timestamps!
  public readonly created_at!: Date;
  public readonly last_updated!: Date;
}

Achievement.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateAchieved: {
      type: DataTypes.DATE, 
      allowNull: false,
      defaultValue: DataTypes.NOW, 
    },
    playerId: {
      type: DataTypes.INTEGER,
      references: {
        model: "players",
        key: "id",
      },
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: "achievements",
    createdAt: "created_at",
    updatedAt: "last_updated",
  }
);

export default Achievement;
