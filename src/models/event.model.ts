import mongoose, { Document, Schema } from "mongoose";

export interface EventDocument extends Document {
  title: string;
  description: string;
  date: Date;
  location: string;
  status?: "scheduled" | "cancelled" | "completed";
  capacity?: number;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<EventDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    status: { type: String, enum: ["scheduled", "cancelled", "completed"], default: "scheduled" },
    capacity: { type: Number },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual to expose registrations related to this event (Registration.event -> Event._id)
EventSchema.virtual("registrations", {
  ref: "Registration",
  localField: "_id",
  foreignField: "event",
});

const Event = mongoose.model<EventDocument>("Event", EventSchema);

export default Event;
