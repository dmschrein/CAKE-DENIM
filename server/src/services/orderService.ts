import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class OrderService {
  // Create a new order when checkout is successful
  async createOrder(data: any) {
    try {
      const {
        totalAmount,
        email,
        paymentId,
        payment,
        status,
        shippingInfo,
        billingInfo,
      } = data;

      // Get the user using email from the auth login session
      const user = await prisma.users.findUnique({
        where: { email: data.email },
      });
      if (!user) {
        throw new Error("User not found");
      }

      // Create new shipping info
      const createdShippingInfo = await prisma.shippingInfo.create({
        data: {
          firstName: shippingInfo.firstName,
          lastName: shippingInfo.lastName,
          address1: shippingInfo.address1,
          address2: shippingInfo.address2,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zipCode: shippingInfo.zipCode,
          country: shippingInfo.country,
          mobilePhone: shippingInfo.mobilePhone,
          deliveryMethod: shippingInfo.deliveryMethod,
        },
      });

      // Create new billing info
      const createdBillingInfo = await prisma.billingInfo.create({
        data: {
          firstName: billingInfo.firstName,
          lastName: billingInfo.lastName,
          address1: billingInfo.address1,
          address2: billingInfo.address2,
          city: billingInfo.city,
          state: billingInfo.state,
          zipCode: billingInfo.zipCode,
          country: billingInfo.country,
          mobilePhone: billingInfo.mobilePhone,
        },
      });

      // Create the order with the user ID and newly created shippingInfoId and billingInfoId
      const order = await prisma.orders.create({
        data: {
          userId: user.userId,
          email,
          shippingInfoId: createdShippingInfo.id,
          billingInfoId: createdBillingInfo.id,
          totalAmount,
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
