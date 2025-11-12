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

router.post('/', authenticateToken, createUserHeartData);

router.put('/:id', authenticateToken, updateUserHeartData);

router.delete('/:id', authenticateToken, deleteUserHeart);

export { router as userHeart };
