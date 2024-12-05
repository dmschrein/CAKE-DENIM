import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import winston from "winston";
import rateLimit from "express-rate-limit";
import { loadSecretsToEnv, validateAWSCredentials } from "./utils/secrets";

/* ROUTE IMPORTS */
import homeRoutes from "./routes/homeRoutes";
import productRoutes from "./routes/productRoutes";
import userRoutes from "./routes/userRoutes";
import checkoutRoutes from "./routes/checkoutRoutes";
import orderRoutes from "./routes/orderRoutes";
import webhookRoutes from "./routes/webhookRoutes";
import { createWebhookController } from "./controllers/webhookController";

(async () => {
  try {
    // Load secrets dynamically
    console.log("Loading secrets into environment variables...");
    await validateAWSCredentials(); // Validate credentials
    await loadSecretsToEnv();
    console.log("Secrets loaded:", {
      stripeSecretKey: process.env.STRIPE_SECRET_KEY,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    });

    const app = express();

    // Determine if we are in development or production mode
    const isDevelopment = process.env.NODE_ENV === "development";

    // Allowed origins
    const allowedOrigins = [
      "http://localhost:3000",
      "https://main.d3pnxtvhsudm94.amplifyapp.com",
    ];

    // Security middleware
    app.use(helmet());
    app.use(
      cors({
        origin: (origin, callback) => {
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error("Not allowed by CORS"));
          }
        },
        methods: "GET, POST, PUT, DELETE",
        credentials: true,
      })
    );

    // Logging setup
    const logger = winston.createLogger({
      level: "info",
      format: winston.format.json(),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: "server.log" }),
      ],
    });
    app.use(
      morgan("common", {
        stream: { write: (message) => logger.info(message.trim()) },
      })
    );

    // Rate limiting
    app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        message: "Too many requests, please try again later.",
      })
    );

    /* Initialize WebhookController */
    const webhookController = await createWebhookController();
    app.use("/api/stripe/", webhookRoutes);

    /* Middleware applied globally */
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    /* ROUTES */
    app.use("/home", homeRoutes);
    app.use("/products", productRoutes);
    app.use("/users", userRoutes);
    app.use("/orders", orderRoutes);
    app.use("/api/stripe", checkoutRoutes);

    /* Error handling middleware */
    app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
      console.error(err.stack);
      res.status(500).json({ message: "An error occurred on the server." });
    });

    /* START SERVER */
    const port = Number(process.env.PORT) || 3001;

    const server = app.listen(port, "0.0.0.0", () => {
      console.log(
        `🚀 Server is running in ${
          isDevelopment ? "development" : "production"
        } mode on port ${port}`
      );
    });

    // Handle EADDRINUSE error
    server.on("error", (error: any) => {
      if (error.code === "EADDRINUSE") {
        console.error(`Port ${port} is already in use.`);
        process.exit(1);
      } else {
        throw error;
      }
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
    console.error("❌ Failed to initialize the application:", error);
    process.exit(1);
  }
})();
