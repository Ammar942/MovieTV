import express from "express";
import cors from "cors";
import entryRoutes from "./routes/entryRoutes";
import { notFoundHandler, errorHandler } from "./middlewares/errorHandler";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/entries", entryRoutes);

// Error Handling Middleware (must be after routes)
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
