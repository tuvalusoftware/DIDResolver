const cardanoSerialization = require("@emurgo/cardano-serialization-lib-nodejs");
const Ajv = require("ajv");
const Logger = require("../logger");

module.exports = {
  validateDIDSyntax: (did, isSalted) => {
    // DID syntax: did:method:companyName:fileNameOrPublicKey
    // Salted DID: uuid:string:did:method:companyName:fileNameOrPublicKey
    if (!did) {
      Logger.error("Undefined did.");
      return { valid: false, detail: "Undefined did." };
    }
    const maxLength = isSalted ? 6 : 4,
      didPosition = isSalted ? 2 : 0,
      didComponents = did.split(":");

    if (
      didComponents.length < maxLength ||
      didComponents[didPosition] !== "did"
    ) {
      Logger.error(
        `Invalid DID syntax. Given did: ${did} should be ${
          isSalted ? "salted" : "unsalted"
        }.`
      );
      return { valid: false };
    }

    Logger.info("Valid did.");
    return {
      valid: true,
      companyName: didComponents[didPosition + 2],
      fileNameOrPublicKey: didComponents[didPosition + 3],
    };
  },

  getAddressFromHexEncoded: (hexAddress) => {
    const address = cardanoSerialization.Address.from_bytes(
      Buffer.from(hexAddress, "hex")
    ).to_bech32();

    Logger.info(`Address from hex (${hexAddress}): ${address}`);
    return address;
  },

  getPublicKeyFromAddress: (bech32Address) => {
    const address = cardanoSerialization.Address.from_bech32(bech32Address);
    const publicKey = Buffer.from(address.to_bytes(), "hex").toString("hex");
    Logger.info(`Publickey from address ${bech32Address} is ${publicKey}`);
    return publicKey;
  },

  validateJSONSchema: (rawSchema, object) => {
    const schema = (({ example, ...props }) => props)(rawSchema);

    const ajv = new Ajv();
    const validate = ajv.compile(schema);

    const valid = validate(object);
    if (!valid)
      Logger.error(`Invalid object.\n${JSON.stringify(validate.errors)}`);
    return valid ? { valid } : { valid, detail: validate.errors };
  },

  checkUndefinedVar: (object) => {
    let detail = "Not found:",
      flag = false;

    for (const [key, value] of Object.entries(object)) {
      if (value === undefined) {
        detail += " " + key;
        flag = true;
      }
    }

    if (flag) Logger.error(`${detail}`);
    else Logger.info(`Valid JSON object.`);
    return flag ? { undefined: true, detail } : { undefined: false };
  },
};
