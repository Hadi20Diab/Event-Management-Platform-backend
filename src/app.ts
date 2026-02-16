import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes";
import errorHandler from "./middlewares/error.middleware";
import adminRoutes from "./routes/admin.routes";
import eventRoutes from "./routes/event.routes";
import registrationRoutes from "./routes/registration.routes";
import authRoutes from "./routes/auth.routes";

const app = express();

app.use(express.json());
app.use(cookieParser());

// Enable CORS for frontend (adjust origin as needed)
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3001",
    credentials: true,
  })
);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    message: "🚀 Event Management Platform API",
    status: "Server running",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/register", registrationRoutes);
app.use(errorHandler);

export default app;
