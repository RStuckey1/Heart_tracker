import express from "express";
import {
  getUser,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../../controllers/usersControllers.js";
import {
  getAccountProfile,
  updateAccountProfile,
} from "../../controllers/accountController.js";

const router = express.Router();

router.get("/settings", getAccountProfile);
router.put("/settings", updateAccountProfile);

router.get("/", getUser);

router.get("/:id", getUserById);

router.post("/", createUser);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

export { router as userRouter };
