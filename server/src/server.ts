import express from "express";
import sequelize from "./config/connection.js";
import routes from "./routes/index.js";
import { DataTypes } from "sequelize";
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static("../client/dist"));

app.use(express.json());

app.use(routes);

sequelize.sync().then(async () => {
  const queryInterface = sequelize.getQueryInterface();
  const userColumns = await queryInterface.describeTable("User");

  if (!("birthday" in userColumns)) {
    await queryInterface.addColumn("User", "birthday", {
      type: DataTypes.DATEONLY,
      allowNull: true,
    });
  }
  if (!("last_birthday_greeting" in userColumns)) {
    await queryInterface.addColumn("User", "last_birthday_greeting", {
      type: DataTypes.DATEONLY,
      allowNull: true,
    });
  }

  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}).catch((error: unknown) => {
  console.error("Failed to initialize database:", error);
  process.exitCode = 1;
});
