import { DataTypes, Model, type Optional, type Sequelize } from "sequelize";
import { User } from "./user.js";

export type JournalCategory = "workout" | "meal" | "symptoms" | "note";

interface IJournalEntry {
  id: number;
  date: string;
  category: JournalCategory;
  content: string;
  UserId: number;
}

interface JournalEntryCreationAttributes extends Optional<IJournalEntry, "id"> {}

export class JournalEntry
  extends Model<IJournalEntry, JournalEntryCreationAttributes>
  implements IJournalEntry
{
  public id!: number;
  public date!: string;
  public category!: JournalCategory;
  public content!: string;
  public UserId!: number;
}

export function JournalEntryFactory(sequelize: Sequelize): typeof JournalEntry {
  JournalEntry.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      category: {
        type: DataTypes.ENUM("workout", "meal", "symptoms", "note"),
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 5000],
        },
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
      tableName: "journal_entries",
      sequelize,
      timestamps: true,
    },
  );
  return JournalEntry;
}
