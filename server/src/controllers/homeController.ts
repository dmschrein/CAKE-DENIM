import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getHomePageMetrics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    //TODO: get hero picture
    const heroImage = await prisma.products.findMany({
      take: 1,
      orderBy: {
        stockQuantity: "desc",
      },
    });
    // TODO: insert other products for home page
    const popularProducts = await prisma.products.findMany({
      take: 4,
      orderBy: {
        stockQuantity: "desc",
      },
    });
    const featureProducts = await prisma.products.findMany({
      take: 2,
      orderBy: {
        createdAt: "desc",
      },
    });
    const blogImages = await prisma.products.findMany({
      take: 3,
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json({
      heroImage,
      popularProducts,
      featureProducts,
      blogImages,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving dashboard metrics", error: error });
  }
};
