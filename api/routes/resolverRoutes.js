const axios = require("axios").default;
// const multer = require("multer");
// const upload = {
//     single: (fileName) =>
//         multer({
//             storage: multer.memoryStorage(),
//         }).single(fileName),
// };

module.exports = function(app) {
    var resolver = require("../controllers/resolverController");

    app.route("/resolver/")
        .get(resolver.getDidDoc);
    
    app.route("/resolver/doc/")
        .post(resolver.createDocument);

}

