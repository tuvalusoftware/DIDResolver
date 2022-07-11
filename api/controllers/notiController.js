const { default: axios } = require("axios");
const { validateJSONSchema, validateDIDSyntax } = require("../../core");
const { ERRORS, SCHEMAS, SERVERS } = require("../../core/constants");

module.exports = {
  createNotification: (req, res) => {
    console.log("Create notification....");

    const { notification } = req.body;

    // Check missing parameters
    if (!notification)
      return res.status(200).json({
        ...ERRORS.MISSING_PARAMETERS,
        detail: "Not found: notification",
      });

    // Validate notification
    const valid = validateJSONSchema(SCHEMAS.NOTIFICATION, notification);
    if (!valid.valid)
      return res.status(200).json({
        ...ERRORS.INVALID_INPUT,
        error_message: "Bad request. Invalid notification.",
        detail: valid.detail,
      });

    try {
      // Check if receiver and sender exist
      const dids = [notification.receiver, notification.sender];
      for (did in dids) {
        const validDid = validateDIDSyntax(did, false),
          companyName = validDid.companyName,
          publicKey = validDid.fileNameOrPublicKey;

        if (!validDid.valid)
          return res.status(200).json({
            ...ERRORS.INVALID_INPUT,
            detail: "Invalid DID syntax.",
          });

        // Call DID Controller to check if DID of receiver and sender exist
        // success:
        const existence = axios.get(SERVERS.DID_CONTROLLER + "/api/did", {
          headers: { companyName, publicKey },
        });

        if (existence.error_code)
          return res.status(200).json(ERRORS.USER_NOT_EXIST);
      }

      // Call DID Controller
      console.log("STORING NOTIFICATION");
      // Handle some error
      return res.status(201).send("Notification created.");
    } catch (err) {
      err.response
        ? res.status(400).json(err.response.data)
        : res.status(400).json(err);
    }
    // res.status(200).send("Create notification");
  },

  changeNotificationStatus: (req, res) => {
    console.log("Changing notification status...");
    res.status(200).send("Change status");
  },

  revokeNotification: (req, res) => {
    console.log("Revoke notification...");
    res.status(200).send("Revoke notification");
  },
};
