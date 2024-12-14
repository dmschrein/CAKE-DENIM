// server/src/routes/productRoutes.ts
import { Router } from "express";
import {
  createProduct,
  getProductById,
  getProducts,
  getProductsByPrimaryCategory,
  getVariantsById, // Import the getVariantsById function
} from "../controllers/productController";

const router = Router();

// New route for fetching products by category name
router.get("/", getProducts);
router.get("/collection/:primaryCategory", getProductsByPrimaryCategory);
router.get("/shopAll", getProducts);
router.get("/:productId", getProductById);
router.get("/:productId/variants", getVariantsById); // New route for fetching variants by productId
router.post("/", createProduct);

export default router;
