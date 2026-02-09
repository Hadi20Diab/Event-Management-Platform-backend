import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("✅ MongoDB connected successfully");
        console.log("📚 Connected database:", mongoose.connection.name);
    } catch (error) {
        console.error("❌ MongoDB connection failed:", (error as Error).message);
        console.log("🔄 Server will continue running without database");
        process.exit(1);
    }
};

export default connectDB;
