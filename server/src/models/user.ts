import { DataTypes, type Sequelize, Model, type Optional } from "sequelize";
import bcrypt from "bcrypt";

interface IUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  age: number;
  password: string;
}

interface UserCreationAttributes extends Optional<IUser, "id"> {}

export class User extends Model<IUser, UserCreationAttributes> implements IUser {
  public id!: number;
  public username!: string;
  public email!: string;
  public first_name!: string;
  public last_name!: string;
  public age!: number;
  public password!: string;

  public async setPassword(password: string) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(password, saltRounds);
  }
}

export function UserFactory(sequelize: Sequelize): typeof User {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },      
    },
    {
      tableName: "user",
      sequelize,
      timestamps: false,
      hooks: {
        beforeCreate: async (user: User) => {
          await user.setPassword(user.password);
        },
        beforeUpdate: async (user: User) => {
          if (user.changed("password")) {
            await user.setPassword(user.password);
          }
        },
      },
    },
  );

  return User;
}
