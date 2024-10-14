import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, email, passwordHash, firstName, lastName } = req.body;
    const user = await prisma.users.create({
      data: {
        userId,
        email,
        passwordHash,
        firstName,
        lastName,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    res.json(500).json({ message: "Error creating user" });
  }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.users.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users" });
  }
};

export const getUserByEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const email = req.query.email?.toString();
    const user = await prisma.users.findUnique({
      //find user with email address
      where: {
        email: email,
      },
    });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user" });
  }
};
