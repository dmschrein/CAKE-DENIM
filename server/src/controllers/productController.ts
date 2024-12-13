import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const categoryName = req.query.categoryName?.toString();
    // const categoryName = req.query.category?.toString();

    // Fetch products based on the search and category filters
    const products = await prisma.products.findMany({
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
        Categories: {
          some: {
            category: {
              categoryName: {
                equals: categoryName,
                mode: "insensitive",
              },
            },
          },
        },
      },
      include: {
        Categories: {
          include: {
            category: {
              select: { categoryName: true, categoryId: true },
            },
          },
        }, // Include categories in the response
        SubCategories: {
          include: {
            subcategory: {
              select: { subcategoryName: true, subcategoryId: true },
            },
          },
        },
      },
    });

    const categories = products.flatMap((product) =>
      product.Categories.map((pc) => pc.category)
    );
    const subcategories = products.flatMap((product) =>
      product.SubCategories.map((psc) => psc.subcategory)
    );
    res.json({
      products,
      categories,
      subcategories,
    });
  } catch (error) {
    console.error("Error retrieving products: ", error);
    res.status(500).json({ message: "Error retrieving products" });
  }
};

export const getProductsByPrimaryCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const primaryCategory = req.params.primaryCategory; // Extract categoryName from the URL parameters

    console.log("Fetching products for category:", primaryCategory);

    // Find the products where the category name matches
    const products = await prisma.products.findMany({
      where: {
        primaryCategory,
      },
      include: {
        Categories: {
          include: {
            category: {
              select: { categoryName: true, categoryId: true },
            },
          },
        },
        SubCategories: {
          include: {
            subcategory: {
              select: { subcategoryName: true, subcategoryId: true },
            },
          },
        },
      },
    });

    // Check if no products were found
    if (!products || products.length === 0) {
      res.status(404).json({ message: "No products found for this category." });
      return;
    }

    // Extract all unique categories and subcategories from the products
    const categories = products.flatMap((product) =>
      product.Categories.map((pc) => pc.category)
    );
    const subcategories = products.flatMap((product) =>
      product.SubCategories.map((psc) => psc.subcategory)
    );

    // Return the products, categories, and subcategories
    res.status(200).json({
      products,
      categories,
      subcategories,
    });
  } catch (error) {
    console.error("Error retrieving products by category name:", error);
    res
      .status(500)
      .json({ message: "Error retrieving products by category name." });
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
      primaryCategory,
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
        primaryCategory,
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
