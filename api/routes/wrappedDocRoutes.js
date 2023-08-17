import express from "express";

// * Cardano controllers
import documentController from "../controllers/cardano/documentController.js";
import authController from "../controllers/cardano/authController.js";

// * Algorand controllers
import algorandDocumentController from "../controllers/algorand/documentController.js";

const router = express.Router();
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
router.post("/v2", algorandDocumentController.createWrappedDocument);
router.delete("/v2", algorandDocumentController.revokeDocument);

export default router;
