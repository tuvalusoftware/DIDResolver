const express = require("express");
const documentController = require("../controllers/documentController");
const authController = require("../controllers/authController");
const router = express.Router();

router.use(authController.ensureAuthenticated);

router.get("/", documentController.getWrappedDocument);
router.post("/", documentController.createWrappedDocument);
router.put("/valid", documentController.validateWrappedDocument);
router.get("/exist", documentController.checkWrappedDocumentExistence);
router.get("/user", documentController.getAllWrappedDocumentsOfUser);
router.put("/transfer", documentController.transferWrappedDocument);
router.delete("/revoke", documentController.revokeDocument);
router.get("/search", documentController.searchWrappedDocument);

module.exports = router;
