// server/src/routes/productRoutes.ts
import { Router } from "express";
import {
  createProduct,
  getProductById,
  getProducts,
  getVariantsById, // Import the getVariantsById function
} from "../controllers/productController";

const router = Router();

router.get("/", getProducts);
router.get("/:productId", getProductById);
router.get("/:productId/variants", getVariantsById); // New route for fetching variants by productId
router.post("/", createProduct);

export default router;
