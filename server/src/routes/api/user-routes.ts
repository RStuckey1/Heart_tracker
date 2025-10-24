import express from "express";
import {
  getUser,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../../controllers/usersControllers.js";

const router = express.Router();

router.get("/", getUser);

router.get("/:id", getUserById);

router.post("/", createUser);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

export { router as userRouter };
