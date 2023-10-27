import mongoose, { Schema } from "mongoose";

/**
 * Represents a request schema for a DID resolver.
 * @typedef {Object} RequestSchema
 * @property {string} did - The DID associated with the request.
 * @property {Object} data - The data associated with the request.
 * @property {string} status - The status of the request. Can be "pending" or "completed".
 * @property {string} type - The type of the request. Can be "mint", "burn", "plot_mint", "update", or "mint_credential".
 * @property {Object} response - The response associated with the request.
 * @property {Date} completedAt - The date the request was completed.
 * @property {Object} cardanoConfig - The Cardano configuration associated with the request.
 */

/**
 * Defines the request schema for a DID resolver.
 * @type {import('mongoose').Schema<RequestSchema>}
 */
const requestSchema = new Schema(
    {
        did: {
            type: String,
            required: true,
        },
        data: {
            type: Object,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "completed"],
            default: "pending",
            required: true,
        },
        type: {
            type: String,
            enum: ["mint", "burn", "plot_mint", "update", "mint_credential"],
            required: true,
        },
        response: {
            type: Object,
        },
        completedAt: {
            type: Date,
        },
        cardanoConfig: {
            type: Object,
        },
    },
    { timestamps: true }
);

export const RequestModel = mongoose.model("Request", requestSchema);
