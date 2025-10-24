import express from "express";
import { authenticateToken } from "../../middleware/auth.js";
import {
  getUserHearts,
  getUserHeartById,
  createUserHeart,
  updateUserHeart,
  deleteUserHeart,
} from "../../controllers/usersHeartController.js";

const router = express.Router();

router.get('/', authenticateToken, getUserHearts);

router.get('/:id', getUserHeartById);

router.post('/', createUserHeart);

router.put('/:id', updateUserHeart);

router.delete('/:id', deleteUserHeart);

export { router as userHeartRouter };
