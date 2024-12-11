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
    const categoryId = req.query.categoryId?.toString();

    // Fetch products based on the search and category filters
    const products = await prisma.products.findMany({
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
        Categories: {
          some: {
            categoryId: categoryId || undefined,
          },
        },
      },
      include: {
        Categories: true, // include categories in the response
        SubCategories: true, // include subcategories in the response
      },
    });

    // Fetch distinct subcategories for the current category
    const subcategories = await prisma.productSubCategories.findMany({
      where: {
        subcategory: {
          categoryId: categoryId || undefined,
        },
      },
      distinct: ["subcategoryId"],
      select: {
        subcategory: {
          select: {
            subcategoryId: true,
            subcategoryName: true,
          },
        },
      },
    });

    // Format subcategories as an array of strings
    const formattedSubcategories = subcategories.map((sub) => ({
      id: sub.subcategory?.subcategoryId,
      name: sub.subcategory?.subcategoryName,
    }));

    res.json({ products, subcategories: formattedSubcategories });
  } catch (error) {
    console.error("Error retrieving products: ", error);
    res.status(500).json({ message: "Error retrieving products" });
  }
};

export const getProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const productId = req.params.productId;

    console.log("Fetching product with ID:", productId); // Debug log

    const product = await prisma.products.findUnique({
      // find one
      where: {
        productId: productId,
      },
      include: {
        Categories: true,
        SubCategories: true,
        ProductVariants: {
          include: {
            variant: true,
          },
        },
      },
    });
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.json(product);
  } catch (error) {
    console.error("Error retrieving product by ID:", error);
    res.status(500).json({ message: "Error retrieving products" });
  }
};

export const getVariantsById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const productId = req.params.productId;

    // Fetch only variants associated with the specified productId
    const productVariants = await prisma.productVariants.findMany({
      where: {
        productId: productId,
      },
      include: {
        variant: true, // Includes the detailed Variant information
      },
    });

    if (!productVariants || productVariants.length === 0) {
      res.status(404).json({ message: "No variants found for this product" });
      return;
    }

    // Extract and return only the variant details from the response
    const variants = productVariants.map((pv) => pv.variant);
    res.json(variants);
  } catch (error) {
    console.error("Error retrieving product variants:", error);
    res.status(500).json({ message: "Error retrieving product variants" });
  }
};

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      productId,
      name,
      description,
      price,
      stockQuantity,
      imageURL,
      categories,
      subCategories,
    } = req.body;
    const product = await prisma.products.create({
      data: {
        productId,
        name,
        description,
        price,
        stockQuantity,
        imageURL,
        Categories: {
          connect: categories.map((categoryId: string) => ({ categoryId })),
        },
        SubCategories: {
          connect: subCategories.map((subcategoryId: string) => ({
            subcategoryId,
          })),
        },
      },
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error creating product" });
  }
};
