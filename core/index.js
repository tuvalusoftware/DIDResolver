const cardanoSerialization = require("@emurgo/cardano-serialization-lib-nodejs");
const Ajv = require("ajv");
const { ERRORS } = require("./constants");

module.exports.validateDIDSyntax = (did) => {
  const didComponents = did.split(":");
  if (didComponents.length < 4 || didComponents[0] !== "did")
    return { valid: false }
  return { valid: true, companyName: didComponents[2], fileNameOrPublicKey: didComponents[3] }
}

module.exports.getAddressFromHexEncoded = (hexAddress) => {
  return cardanoSerialization.Address.from_bytes(Buffer.from(hexAddress, 'hex')).to_bech32();
};

module.exports.getPublicKeyFromAddress = (bech32Address) => {
  const address = cardanoSerialization.Address.from_bech32(bech32Address);
  const publicKey = cardanoSerialization.BaseAddress.from_address(address).payment_cred().to_keyhash();
  return publicKey;
}

module.exports.validateJSONSchema = (schema, object) => {
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  const valid = validate(object);
  console.log(valid);
  return valid ? { valid } : { valid, detail: validate.errors };
}
