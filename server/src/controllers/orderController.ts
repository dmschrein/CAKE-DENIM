import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { OrderService } from "../services/orderService";

const prisma = new PrismaClient();

class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  //Order Management
  public async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      console.log("Recevied order data: ", data);
      const result = await this.orderService.createOrder(data);
      console.log("Successfully created order: ", result);
      res.status(201).json(result);
    } catch (error: any) {
      console.log("Error creating order: ", error);
      res.status(500).json({ error: error.message });
    }
  }
}

export default new OrderController();
