import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getDashboardMetrics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    //TODO: get hero picture
    const popularProducts = await prisma.products.findMany({
      take: 5,
      orderBy: {
        stockQuantity: "desc",
      },
    });
    // TODO: insert other products for home page
  } catch (error) {
    res.status(500).json({ message: "Error retrieving dashboard metrics" });
  }
};
