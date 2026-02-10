import { Schema, model, Document, Types } from "mongoose";

export interface IRegistration extends Document {
    user: Types.ObjectId;
    event: Types.ObjectId;
    status: "registered" | "cancelled";
    createdAt: Date;
    updatedAt: Date;
}

const registrationSchema = new Schema<IRegistration>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
        status: { type: String, enum: ["registered", "cancelled"], default: "registered" }
    },
    { timestamps: true }
);

export default model<IRegistration>("Registration", registrationSchema);
