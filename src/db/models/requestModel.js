import mongoose, { Schema } from "mongoose";

const requestSchema = new Schema(
    {
        data: {
            type: Object,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "minting", "completed"],
            default: "pending",
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        response: {
            type: Object,
        },
        error: {
            type: Object,
        },
        completedAt: {
            type: Date,
        },
    },
    { timestamps: true }
);

export const RequestModel = mongoose.model("Request", requestSchema);
