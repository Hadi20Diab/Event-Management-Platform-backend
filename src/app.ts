import express from "express";
import userRoutes from "./routes/user.routes";
import errorHandler from "./middlewares/error.middleware";
import adminRoutes from "./routes/admin.routes";
import eventRoutes from "./routes/event.routes";

const app = express();

app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    message: "🚀 Event Management Platform API",
    status: "Server running",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/admins", adminRoutes);
app.use(errorHandler);

export default app;
