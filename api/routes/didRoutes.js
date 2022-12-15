const express = require("express");
const authController = require("../controllers/cardano/authController");
const didController = require("../controllers/cardano/didController");
const router = express.Router();

router.use(authController.ensureAuthenticated);

router.get("", didController.retrieveUserDid);
router.post("", didController.createUserDid);
router.put("", didController.updateUserDid);
router.delete("", didController.deleteUserDid);
router.get("/all", didController.retrieveAllUsersDid);

module.exports = router;
