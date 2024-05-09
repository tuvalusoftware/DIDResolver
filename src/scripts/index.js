async function deleteDB() {
    return await mongoose.connection.dropDatabase();
}