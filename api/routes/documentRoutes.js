const express = require('express');
const documentController = require("../controllers/documentController");
const router = express.Router();

//  router.use(authControler.ensureAuthenticated);

router.get("/document", documentController.getDocuments);
router.post("/did-document", documentController.createDIDDocument);

module.exports = router;