const express = require("express");
const documentController = require("../controllers/documentController");
const router = express.Router();

//  router.use(authControler.ensureAuthenticated);

router.get("/document", documentController.getDocuments);

router.get("/did-document", documentController.getDIDDocument);
router.post("/did-document", documentController.createDIDDocument);

router.post("/wrapped-document", documentController.createWrappedDocument);
router.get("/wrapped-document/valid", documentController.validateWrappedDocument);
router.get("/wrapped-document/exist", documentController.checkWrappedDocumentExistence);



module.exports = router;