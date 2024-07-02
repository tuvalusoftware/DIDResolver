import mongoose from "mongoose";

async function deleteDB() {
    return await mongoose.connection.dropDatabase();
}

export {
    deleteDB
}