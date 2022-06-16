const express = require("express");
const cardanoController = require("../controllers/cardanoController");
const router = express.Router();

//  router.use(authControler.ensureAuthenticated);

router.get("/nfts", cardanoController.getNFTs);
router.get("/hash/verify", cardanoController.verifyHash);
router.get("/signature/verify", cardanoController.verifySignature);

module.exports = router;