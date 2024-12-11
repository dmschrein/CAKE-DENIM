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
        Categories: true, // Include categories in the response
        SubCategories: {
          include: {
            subcategory: {
              select: { subcategoryName: true, subcategoryId: true },
            },
          },
        }, // Include subcategories in the response
      },
    });

    // Fetch distinct subcategories for the current category
    const subcategories = await prisma.productSubCategories.findMany({
      where: categoryId
        ? {
            subcategory: {
              categoryId,
            },
          }
        : undefined,
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

    // Fetch distinct categories
    const categories = await prisma.productCategories.findMany({
      distinct: ["categoryId"],
      select: {
        category: {
          select: {
            categoryId: true,
            categoryName: true,
          },
        },
      },
    });

    // Format subcategories and categories
    const formattedCategories = categories.map((cat) => ({
      id: cat.category?.categoryId,
      name: cat.category?.categoryName,
    }));
    const formattedSubcategories = subcategories.map((sub) => ({
      id: sub.subcategory?.subcategoryId,
      name: sub.subcategory?.subcategoryName,
    }));

    res.json({
      products,
      categories: formattedCategories,
      subcategories: formattedSubcategories,
    });
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

    console.log("Fetching product with ID:", productId);

    const product = await prisma.products.findUnique({
      where: {
        productId,
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
    res.status(500).json({ message: "Error retrieving product" });
  }
};

export const getVariantsById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const productId = req.params.productId;

    const productVariants = await prisma.productVariants.findMany({
      where: {
        productId,
      },
      include: {
        variant: true,
      },
    });

    if (!productVariants || productVariants.length === 0) {
      res.status(404).json({ message: "No variants found for this product" });
      return;
    }

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
    console.error("Error creating product: ", error);
    res.status(500).json({ message: "Error creating product" });
  }
};
