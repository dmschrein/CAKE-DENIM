import { Router } from "express";
import { getHomePageMetrics } from "../controllers/homeController";

const router = Router();

router.get("/", getHomePageMetrics);

export default router;
