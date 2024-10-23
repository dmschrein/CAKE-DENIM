// server/src/index.ts
import express, { Request, Response, NextFunction } from "express";

import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

/* ROUTE IMPORTS */
import homeRoutes from "./routes/homeRoutes";
import productRoutes from "./routes/productRoutes";
import userRoutes from "./routes/userRoutes";
import checkoutRoutes from "./routes/checkoutRoutes";

/* CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: "GET, POST, PUT, DELETE",
    credentials: true,
  })
);

/* ROUTES */
app.use("/home", homeRoutes); // http://localhost:8000/home
app.use("/products", productRoutes); // http://localhost:8000/products
app.use("/users", userRoutes);
app.use("/api/checkout", checkoutRoutes); // TODO: check if i need api

/* Error handling middleware */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "An error occurrred on the server." });
});

/* SERVER */
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
