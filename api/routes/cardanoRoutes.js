const express = require("express");
const cardanoController = require("../controllers/cardanoController");
const router = express.Router();

//  router.use(authControler.ensureAuthenticated);

router.get("/nft", cardanoController.getNFTs);
router.get("/hash/verify", cardanoController);
router.get("/signature/verify", cardanoController.verifySignature);



module.exports = router;