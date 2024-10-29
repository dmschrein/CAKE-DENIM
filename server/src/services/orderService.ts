// server/src/services/orderService.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class OrderService {
  // create a new order when checkout is successful
  async createOrder(data: any) {
    try {
      const { totalAmount, deliveryType, paymentId, payment, status } = data;
      // get the customer using email from auth log in session and create an order for the user
      const user = await prisma.users.findUnique({
        where: { email: data.email },
      });
      if (!user) {
        throw new Error("User not found");
      }
      // Create the order with the user id
      const order = await prisma.orders.create({
        data: {
          userId: user.userId,
          totalAmount,
          deliveryType,
          paymentId,
          payment,
          status,
        },
      });
      console.log("Order created successfully: ", order);
      return order;
    } catch (error: any) {
      throw new Error(`Failed to create order: ${error.message}`);
    }
  }
}
