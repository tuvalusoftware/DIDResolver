const express = require("express");
const credentialController = require("../controllers/credentialController");
const router = express.Router();

//  router.use(authControler.ensureAuthenticated);

router.post("/credential", credentialController.createCredential);

module.exports = router;