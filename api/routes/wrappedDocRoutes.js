const express = require("express");

// * Cardano controllers
const documentController = require("../controllers/cardano/documentController");
const authController = require("../controllers/cardano/authController");
const router = express.Router();

// * Algorand controllers
const algorandDocumentController = require('../controllers/algorand/documentController');

router.use(authController.ensureAuthenticated);

/**
 * Resolver DID document endpoints v1 ( support for cardano network )
 */
router.get("/", documentController.getWrappedDocument);
router.post("/", documentController.createWrappedDocument);
router.put("/valid", documentController.validateWrappedDocument);
router.get("/exist", documentController.checkWrappedDocumentExistence);
router.get("/user", documentController.getAllWrappedDocumentsOfUser);
router.put("/transfer", documentController.transferWrappedDocument);
router.delete("/revoke", documentController.revokeDocument);
router.get("/search", documentController.searchWrappedDocument);

/**
 * Resolver DID document endpoints v2 ( support for cardano, and algorand networks )
 */
router.post('/v2', algorandDocumentController.createWrappedDocument)

module.exports = router;
