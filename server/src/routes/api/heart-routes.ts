import express from "express";
import { authenticateToken } from "../../middleware/auth.js";
import {
  getUserHeartData,
  createUserHeartData,
  updateUserHeartData,
  deleteUserHeart,
} from "../../controllers/usersHeartController.js";

const router = express.Router();

router.get('/', authenticateToken, getUserHeartData);

router.post('/', createUserHeartData);

router.put('/:id', updateUserHeartData);

router.delete('/:id', deleteUserHeart);

export { router as userHeart };
