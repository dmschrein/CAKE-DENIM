import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const saltRounds = 10;

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Hash the password
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user without specifying userId
    const user = await prisma.users.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user" });
  }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const email = req.query.email?.toString();
    if (email) {
      const user = await prisma.users.findUnique({
        where: { email },
      });
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.json(user);
    } else {
      // if no email, return all users
      const users = await prisma.users.findMany();
      res.json(users);
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users" });
  }
};
