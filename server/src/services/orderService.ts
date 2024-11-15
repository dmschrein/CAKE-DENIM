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
        orderItems,
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

      // Fetch each variant and create OrderItems with variant information
      const items = await Promise.all(
        orderItems.map(async (item: any) => {
          console.log("Order items: ", orderItems);
          const variant = await prisma.variants.findUnique({
            where: { variantId: item.variantId },
          });

          if (!variant) {
            throw new Error(`Variant with ID ${item.variantId} not found`);
          }

          return {
            variantId: variant.variantId,
            size: variant.size,
            color: variant.color,
            price: variant.price,
            quantity: item.quantity,
          };
        })
      );

      // Create the order with the user ID, shippingInfoId, billingInfoId, and OrderItems
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
          OrderItems: {
            create: items,
          },
        },
      });
      console.log("Order created successfully: ", order);
      return order;
    } catch (error: any) {
      throw new Error(`Failed to create order: ${error.message}`);
    }
  }
  // get an order by user id
  async getOrders(userId: string) {
    try {
      // Get the orders using userId
      const orders = await prisma.orders.findMany({
        where: { userId },
        include: {
          OrderItems: true,
        },
      });
      return orders;
    } catch (error: any) {
      throw new Error(`Failed to retrieve orders: ${error.message}`);
    }
  }
}
