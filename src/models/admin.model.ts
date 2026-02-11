import { Schema, model, Document } from "mongoose";

export interface IAdmin extends Document {
  name: string;
  email: string;
  phone: string;
  role: "admin" | "superAdmin";
}

const adminSchema = new Schema<IAdmin>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    phone: { type: String, required: true, unique: true, trim: true },
    role: {
      type: String,
      required: true,
      enum: ["admin", "superAdmin"],
      trim: true,
    },
  },
  { timestamps: true },
);

export default model<IAdmin>("Admin", adminSchema);
