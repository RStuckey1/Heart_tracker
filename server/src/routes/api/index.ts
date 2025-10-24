import { userRouter } from "./user-routes.js";
import { userHeart as userHeartRouter } from "./heart-routes.js";
import { Router } from "express";

const router = Router();

router.use("/user", userRouter);
router.use("/userHeart", userHeartRouter);


export default router;
