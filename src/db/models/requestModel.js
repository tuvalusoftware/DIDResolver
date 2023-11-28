import mongoose, { Schema } from "mongoose";

/**
 * @typedef {Object} Request
 * @property {Object} data - The data of the request.
 * @property {string} status - The status of the request. Can be "pending" or "completed".
 * @property {string} type - The type of the request. Can be "mint", "burn", "plot_mint", "update", or "mint_credential".
 * @property {Object} response - The response of the request.
 * @property {Date} completedAt - The date when the request was completed.
 */

/**
 * Defines the schema for a request.
 * @type {import('mongoose').Schema<Request>}
 */
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
