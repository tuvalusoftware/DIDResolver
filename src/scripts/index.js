import mongoose from "mongoose";

/**
 * @async
 * @description Delete all collections in Database
 */
export const deleteDB = async () => {
    const collections = mongoose.connection.collections;

    await Promise.all(
        Object.values(collections).map(async (collection) => {
            await collection.deleteMany({}); // an empty mongodb selector object ({}) must be passed as the filter argument
        })
    );
};
