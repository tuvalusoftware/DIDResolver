const documentRoutes = require("./documentRoutes");

module.exports = (app) => {
    app.use("/resolver", documentRoutes);
}