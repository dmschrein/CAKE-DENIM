// server/src/routes/userRoutes.ts

import { Router } from "express";
import {
  createUser,
  getUsers,
  updateUser,
} from "../controllers/userController";

const router = Router();

router.get("/", getUsers);
router.post("/", createUser);
router.patch("/:userId", updateUser);

export default router;
