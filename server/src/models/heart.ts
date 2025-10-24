import { DataTypes, Sequelize, Model, Optional } from "sequelize";
import { User} from "./user.js";

interface IHeart {
  id: number;
  systolic: number;
  diastolic: number;
  pulse: number;
  weight: number;
  UserId: number ;  // foreign key to User
}

interface HeartCreationAttributes extends Optional<IHeart, "id"> { }

export class Heart extends Model<IHeart, HeartCreationAttributes> implements IHeart {

    public id!: number;
    public systolic!: number;
    public diastolic!: number;
    public pulse!: number;
    public weight!: number;
    public UserId!: number; //foreign key to User

}



export function VehicleFactory(sequelize: Sequelize): typeof Heart {
  Heart.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      systolic: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      diastolic: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      pulse: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      weight: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: User,
          key: "id",
        },
      },
    },
    {
      tableName: "userHeart",
      sequelize,
      timestamps: true,
    },
  );
  return Heart;
}
