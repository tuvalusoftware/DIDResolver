const documentRoutes = require("./documentRoutes");
const cardanoRoutes = require("./cardanoRoutes");

// console.log(documentRoutes);
// console.log(cardanoRoutes);

module.exports = (app) => {
    app.use("/resolver", documentRoutes);
    app.use("/resolver", cardanoRoutes);
}