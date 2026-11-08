import { userRouter } from "./user-routes.js";
import { userHeart as userHeartRouter } from "./heart-routes.js";
import { Router } from "express";
import { journalRouter } from "./journal-routes.js";

const router = Router();

router.use("/user", userRouter);
router.use("/heart", userHeartRouter);
router.use("/journal", journalRouter);


export default router;
