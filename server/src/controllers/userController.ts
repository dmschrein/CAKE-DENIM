import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { sendSignupConfirmationEmail } from "../actions/email";

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
      if (existingUser.userType == "REGISTERED") {
        console.log("User already exists. Blocking account creation.");
        res.status(400).json({
          error: "USER_ALREADY_EXISTS",
          message:
            "An account with this email already exists. Please log in or use a different email.",
        });
        return;
      } else {
        // else if user exists (as GUEST or EMAIL_ONLY) but is creating an account. Update their information.
        console.log("Upgrading existing user to REGISTERED.");
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
    // Send signup confirmation email
    try {
      await sendSignupConfirmationEmail(newUser.email, newUser.firstName);
      console.log("Signup confirmation email sent successfully.");
    } catch (emailError) {
      console.error("Failed to send signup confirmation email:", emailError);
    }

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
    const {
      email,
      password,
      firstName,
      lastName,
      userType,
      phone,
      gender,
      preferredSize,
      birthday,
    } = req.body;

    console.log("Received user data: ", { email, userType });
    // Fetch user from the database
    const user = await prisma.users.findUnique({
      where: { userId },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

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
        passwordHash: passwordHash || undefined, // Update only if password is provided
        firstName,
        lastName,
        userType,
        phone,
        gender,
        preferredSize,
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
          : undefined, // Update only if provided
      },
    });
    console.log("User updated successfully: ", updatedUser);
    res.status(200).json(updateUser);
  } catch (error) {
    console.error("Error updating user: ", error);
    res.status(500).json({ message: "Error updating user" });
  }
};

export const updatePassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!userId || !currentPassword || !newPassword) {
      res.status(400).json({ message: "All fields are required." });
      return;
    }

    const user = await prisma.users.findUnique({
      where: { userId },
    });

    if (!user || !user.passwordHash) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    // Verify the current password
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      res.status(400).json({ message: "Incorrect current password." });
      return;
    }

    // Prevent setting the same password
    const isSamePassword = await bcrypt.compare(newPassword, user.passwordHash);
    if (isSamePassword) {
      res.status(400).json({
        message: "New password cannot be the same as the old password.",
      });
      return;
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password in the database
    await prisma.users.update({
      where: { userId },
      data: { passwordHash: hashedPassword },
    });

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Error updating password." });
  }
};
export const updateFavorites = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { productId } = req.body;

    if (!userId || !productId) {
      res.status(400).json({ message: "User ID and Product ID are required." });
      return;
    }

    const user = await prisma.users.findUnique({
      where: { userId },
      include: { favoriteProducts: true },
    });

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    const isFavorite = user.favoriteProducts.some(
      (product) => product.productId === productId
    );

    await prisma.users.update({
      where: { userId },
      data: {
        favoriteProducts: isFavorite
          ? { disconnect: { productId } } // Remove from favorites
          : { connect: { productId } }, // Add to favorites
      },
    });

    res.status(200).json({
      message: isFavorite ? "Removed from favorites." : "Added to favorites.",
    });
  } catch (error) {
    console.error("Error updating favorites:", error);
    res.status(500).json({ message: "Error updating favorites." });
  }
};

export const getFavorites = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({ message: "User ID is required." });
      return;
    }

    const user = await prisma.users.findUnique({
      where: { userId },
      include: { favoriteProducts: true },
    });

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    res.status(200).json(user.favoriteProducts);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ message: "Error fetching favorites." });
  }
};
