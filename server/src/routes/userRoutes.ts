// server/src/routes/userRoutes.ts

import { Router } from "express";
import {
  createUser,
  getUserByEmail,
  getUsers,
} from "../controllers/userController";

const router = Router();

router.get("/", getUsers);
router.get("/:email", getUserByEmail);
router.post("/", createUser);

export default router;
