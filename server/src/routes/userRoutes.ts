// server/src/routes/userRoutes.ts

import { Router } from "express";
import {
  createUser,
  getUsers,
  updateUser,
} from "../controllers/userController";

const router = Router();

// Route to get all users
router.get("/", getUsers);
// Route to get a single user by ID
router.get("/:userId", getUsers);
router.post("/", createUser);
router.patch("/:userId", updateUser);

export default router;
