const express = require("express");
const documentController = require("../controllers/documentController");
const router = express.Router();

//  router.use(authControler.ensureAuthenticated);

// router.get("/document", documentController.getDocuments);

router.get("/did-document", documentController.getDIDDocument);
router.post("/did-document", documentController.createDIDDocument);

router.get("/wrapped-document", documentController.getWrappedDocument);
router.post("/wrapped-document", documentController.createWrappedDocument);
router.put("/wrapped-document", documentController.updateWrappedDocument);
router.put("/wrapped-document/valid", documentController.validateWrappedDocument);
router.get("/wrapped-document/exist", documentController.checkWrappedDocumentExistence);
router.get("/wrapped-document/user", documentController.getAllWrappedDocuments);

module.exports = router;