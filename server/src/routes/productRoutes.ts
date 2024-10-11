
// server/src/routes/productRoutes.ts

import { Router } from "express";
import {
  createProduct,
  getProductById,
  getProducts,
} from "../controllers/productController"
import { Router } from "express";
import { createProduct, getProducts } from "../controllers/productController";

const router = Router();

router.get("/", getProducts);
router.get("/:productId", getProductById);
router.post("/", createProduct);

export default router;
