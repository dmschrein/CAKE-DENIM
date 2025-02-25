import { PrismaClient } from "@prisma/client";
import { CreateOrderInput, OrderItemInput } from "../types/order.types";

const prisma = new PrismaClient();

export class OrderService {
  // Create a new order when checkout is successful
  async createOrder(data: CreateOrderInput) {
    try {
      const {
        totalAmount,
        email,
        payment,
        status,
        shippingInfo,
        billingInfo,
        orderItems,
      } = data;

      // Get the user using email from the auth login session
      const user = await prisma.users.findUnique({ where: { email } });
      if (!user) {
        throw new Error("User not found");
      }

      // Create new shipping info
      const createdShippingInfo = await prisma.shippingInfo.create({
        data: shippingInfo,
      });

      // Create new billing info
      const createdBillingInfo = await prisma.billingInfo.create({
        data: {
          firstName: billingInfo.firstName,
          lastName: billingInfo.lastName,
          address1: billingInfo.address1,
          address2: billingInfo.address2 || "", // ✅ Ensure it's always a string
          city: billingInfo.city,
          state: billingInfo.state,
          zipCode: billingInfo.zipCode,
          country: billingInfo.country,
          mobilePhone: billingInfo.mobilePhone || null, // ✅
        },
      });

      // Fetch each variant and create OrderItems with variant information
      const items = await Promise.all(
        orderItems.map(async (item: OrderItemInput) => {
          const variant = await prisma.variants.findUnique({
            where: { variantId: item.variantId },
            include: { products: { include: { product: true } } },
          });

          if (!variant) {
            throw new Error(`Variant with ID ${item.variantId} not found`);
          }

          const product = variant.products[0]?.product;
          if (!product) {
            throw new Error(
              `Product for variant ID ${item.variantId} not found`
            );
          }

          return {
            variantId: variant.variantId,
            productId: product.productId,
            size: variant.size,
            color: variant.color,
            price: variant.price,
            quantity: item.quantity,
          };
        })
      );

      // Handle payment (connect or create)
      let paymentData = {};
      if (payment) {
        if (payment.paymentId) {
          paymentData = {
            payment: { connect: { paymentId: payment.paymentId } },
          };
        } else {
          const newPayment = await prisma.paymentInfo.create({
            data: {
              paymentType: "CREDIT_CARD", // Default to CREDIT_CARD, modify as needed
              method: payment.method,
              cardLast4Digits: payment.cardLast4Digits,
            },
          });
          paymentData = { paymentId: newPayment.paymentId };
        }
      }

      // Create the order
      const order = await prisma.orders.create({
        data: {
          email,
          shippingInfoId: createdShippingInfo.id,
          billingInfoId: createdBillingInfo.id,
          totalAmount,
          status,
          userId: user.userId, // ✅ Ensure userId is explicitly assigned
          OrderItems: {
            create: items,
          },
          ...paymentData, // ✅ Ensures correct handling of payment
        },
        include: {
          shippingInfo: true,
          billingInfo: true,
          payment: true,
          Users: true,
          OrderItems: {
            include: {
              variant: true,
              product: true,
            },
          },
        },
      });

      console.log("Order created successfully: ", order);
      return order;
    } catch (error: unknown) {
      throw new Error(`Failed to create order: ${(error as Error).message}`);
    }
  }

  // get an order by user id
  async getOrders(userId: string) {
    try {
      // Get the orders using userId
      const orders = await prisma.orders.findMany({
        where: { userId },
        include: {
          Users: true,
          shippingInfo: true,
          billingInfo: true,
          payment: true,
          OrderItems: {
            include: {
              variant: true,
              product: true,
            },
          },
        },
      });
      return orders;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to retrieve orders: ${error.message}`);
      }
      throw new Error("An unknown error occurred while retrieving orders.");
    }
  }
}
