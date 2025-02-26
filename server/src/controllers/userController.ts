import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const saltRounds = 10;

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
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
    res.status(500).json({ message: "Unknown error retrieving users" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const user = await prisma.users.findUnique({
      where: { userId },
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: "Unknown failed to fetch user" });
  }
};

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
      phone,
      gender,
      preferredSize,
      birthday,
    } = req.body; // Set default values for optional fields

    console.log("Received user data: ", { email, userType });

    // Check if user already exists
    const existingUser = await prisma.users.findUnique({
      where: { email },
      include: { birthday: true },
    });

    // If user exists and is trying to sign up using a different method
    if (existingUser) {
      switch (userType) {
        case "EMAIL_ONLY":
        case "GUEST":
          // If the user exists and is EMAIL_ONLY or GUEST, return the existing user
          console.log(
            "Opt-in or Guest user already exists. Returning existing user."
          );
          res.status(200).json(existingUser);
          return;
        case "REGISTERED":
          // if user exists and userType is REGISTER, ask user to log in
          if (existingUser.userType === "REGISTERED") {
            res.status(400).json({
              message:
                "Email already exists. Please log in or use other email.",
            });
            return;
          } else {
            // else if user exists (as GUEST or EMAIL_ONLY) but is creating an account. Update their information.
            console.log("User is already in system. Update their information.");
            const updatedUser = await prisma.users.update({
              where: { email },
              data: {
                passwordHash: password
                  ? await bcrypt.hash(password, saltRounds)
                  : existingUser.passwordHash,
                firstName: firstName || existingUser.firstName,
                lastName: lastName || existingUser.lastName,
                phone: phone || existingUser.phone,
                gender: gender || existingUser.gender,
                preferredSize: preferredSize || existingUser.preferredSize,
                userType: "REGISTERED",

                birthday: birthday
                  ? {
                      upsert: {
                        create: {
                          month: birthday.month,
                          day: birthday.day,
                          year: birthday.year,
                        },
                        update: {
                          month: birthday.month,
                          day: birthday.day,
                          year: birthday.year,
                        },
                      },
                    }
                  : undefined, // Only update birthday if provided
              },
              include: { birthday: true },
            });

            console.log("User upgraded to REGISTERED:", updatedUser);
            res.status(200).json(updatedUser);
            return;
          }
        default:
          res.status(400).json({
            message: "Email already exists. Please log in or use other email.",
          });
          return;
      }
    }
    // Provide a default value for passwordHash if no password is provided
    const passwordHash = password
      ? await bcrypt.hash(password, saltRounds)
      : "";

    // Create user without specifying userId, with only email required
    const newUser = await prisma.users.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        userType,
        phone,
        gender,
        preferredSize,
        birthday: birthday
          ? {
              create: {
                month: birthday.month,
                day: birthday.day,
                year: birthday.year,
              },
            }
          : undefined, // Only create birthday if provided
      },
      include: { birthday: true },
    });
    console.log("User created successfully: ", newUser);
    res.status(201).json(newUser); // Send the created user as the response
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user" });
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params; // provided by session
    const { email, password, firstName, lastName, userType } = req.body;

    console.log("Received user data: ", { email, userType });

    // Hash the password if it is being updated
    let passwordHash;
    if (password) {
      passwordHash = await bcrypt.hashSync(password, saltRounds);
    }
    // Update the user
    const updatedUser = await prisma.users.update({
      where: { userId },
      data: {
        email,
        passwordHash: passwordHash || undefined, // Only update if password is provided
        firstName,
        lastName,
        userType,
      },
    });
    console.log("User updated successfully: ", updatedUser);
    res.status(200).json(updateUser);
  } catch (error) {
    console.error("Error updating user: ", error);
    res.status(500).json({ message: "Error updating user" });
  }
};
