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
    const {
      email,
      password,
      firstName = "",
      lastName = "",
      userType,
    } = req.body; // Set default values for optional fields

    console.log("Received user data: ", { email, userType });
    // Provide a default value for passwordHash if no password is provided
    const passwordHash = password
      ? await bcrypt.hash(password, saltRounds)
      : "";

    // Create user without specifying userId, with only email required
    const user = await prisma.users.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        userType,
      },
    });
    console.log("User created successfully: ", user);
    res.status(201).json(user); // Send the created user as the response
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
