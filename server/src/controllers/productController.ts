
// server/src/controllers/productControllers.ts

import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const search = req.query.search?.toString();

    const category = req.query.category?.toString();

    const products = await prisma.products.findMany({
      where: {
        name: {
          contains: search,
        },

        category: category || undefined, // Filter by category if provided

      },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving products" });
  }
};

export const getProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const productId = req.params.productId;
    const product = await prisma.products.findUnique({
      // find one
      where: {
        productId: productId,
      },
    });
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving products" });
  }
};

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId, name, description, price, stockQuantity, imageURL } =
      req.body;
    const product = await prisma.products.create({
      data: {
        productId,
        name,
        description,
        price,
        stockQuantity,
        imageURL,
      },
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error creating product" });
  }
};
