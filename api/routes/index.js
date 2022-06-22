const documentRoutes = require("./documentRoutes");
const cardanoRoutes = require("./cardanoRoutes");
const credentialRoutes = require("./credentialRoutes");

// console.log(documentRoutes);
// console.log(cardanoRoutes);

module.exports = (app) => {
    app.use("/resolver", documentRoutes);
    app.use("/resolver", cardanoRoutes);
    app.use("/resolver/", credentialRoutes);
}