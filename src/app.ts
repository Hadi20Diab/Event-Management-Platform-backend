import express from "express";
import userRoutes from "./routes/user.routes";
import errorHandler from "./middlewares/error.middleware";

const app = express();

app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
    res.json({ 
        message: "🚀 Event Management Platform API", 
        status: "Server running",
        timestamp: new Date().toISOString()
    });
});

app.use("/api/users", userRoutes);
app.use("/api/events", userRoutes);
app.use(errorHandler);

export default app;
