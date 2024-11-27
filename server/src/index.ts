// server/src/index.ts
import express, { Request, Response, NextFunction } from "express";

// import dotenv from "dotenv"; local deployment only
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import AWS from "aws-sdk";
import winston from "winston";
import rateLimit from "express-rate-limit";

/* ROUTE IMPORTS */
import homeRoutes from "./routes/homeRoutes";
import productRoutes from "./routes/productRoutes";
import userRoutes from "./routes/userRoutes";
import checkoutRoutes from "./routes/checkoutRoutes";
import orderRoutes from "./routes/orderRoutes";
import webhookRoutes from "./routes/webhookRoutes";
import { createWebhookController } from "./controllers/webhookController";

/* AWS SECRETS CONFIGURATION */
const ssm = new AWS.SSM();
const getSSMParameter = async (name: string): Promise<string> => {
  const response = await ssm
    .getParameter({ Name: name, WithDecryption: true })
    .promise();
  return response.Parameter?.Value || "";
};

/* SERVER CONFIGURATIONS */
(async () => {
  try {
    //Load secrets dynamically
    process.env.STRIPE_SECRET_KEY = await getSSMParameter("/stripe/secret_key");
    process.env.STRIPE_WEBHOOK_SECRET = await getSSMParameter(
      "/stripe/webhook_secret"
    );

    // dotenv.config();
    const app = express();

    //Set up security middleware
    app.use(helmet());
    app.use(
      cors({
        origin: process.env.CORS_ORIGIN || "http://localhost:3000",
        methods: "GET, POST, PUT, DELETE",
        credentials: true,
      })
    );

    // Loggin setup
    const logger = winston.createLogger({
      level: "info",
      format: winston.format.json(),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          filename: "server.log",
        }),
      ],
    });
    app.use(
      morgan("common", { stream: { write: (message) => logger.info(message) } })
    );

    // Rate limiting
    app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
      })
    );

    /* Initialize WebhookController */
    const webhookController = await createWebhookController();
    /* WEBHOOK ROUTES */
    app.use("/api/stripe/", webhookRoutes);

    console.log("WebhookController intialized successfully.");

    /* Middleware applied globally after webhook route */
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    /* ROUTES */
    app.use("/home", homeRoutes); // http://localhost:8000/home
    app.use("/products", productRoutes); // http://localhost:8000/products
    app.use("/users", userRoutes);
    app.use("/orders", orderRoutes);
    app.use("/api/stripe", checkoutRoutes);

    /* Error handling middleware */
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      console.error(err.stack);
      res.status(500).json({ message: "An error occurrred on the server." });
    });

    /* START SERVER */
    const port = Number(process.env.PORT) || 3001;
    const server = app.listen(port, "0.0.0.0", () => {
      console.log(`Server running on port ${port}`);
    });

    // Graceful shutdown
    process.on("SIGTERM", () => {
      logger.info("SIGTERM received. Shutting down...");
      server.close(() => process.exit(0));
    });

    process.on("SIGINT", () => {
      logger.info("SIGINT received. Shutting down...");
      server.close(() => process.exit(0));
    });
  } catch (error) {
    console.error("Failed to initialize the application: ", error);
    process.exit(1);
  }
})();
