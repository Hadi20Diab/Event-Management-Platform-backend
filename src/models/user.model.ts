import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  phoneNumber: string;
  address:string;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
        "Email must be a valid @gmail.com address",
      ],
    },

    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
    
    },
      address: {
      type: String,
       
    },
  },
  { timestamps: true }
);

export default model<IUser>("User", userSchema);
