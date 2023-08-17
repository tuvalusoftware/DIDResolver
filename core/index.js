import cardanoSerialization from "@emurgo/cardano-serialization-lib-nodejs";
import Ajv from "ajv";
import Logger from "../logger.js";
import * as BIP39 from "bip39";
import { C as CardanoWasm } from "lucid-cardano";
import * as dotenv from "dotenv";
dotenv.config();

const validateDIDSyntax = (did, isSalted) => {
  // DID syntax = did:method:companyName:fileNameOrPublicKey
  // Salted DID = uuid:string:did:method:companyName:fileNameOrPublicKey
  if (!did) {
    Logger.error("Undefined did.");
    return { valid: false, detail: "Undefined did." };
  }
  const maxLength = isSalted ? 6 : 4;
  const didPosition = isSalted ? 2 : 0;
  const didComponents = did.split(":");

  if (
    didComponents.length < maxLength ||
    didComponents[didPosition] !== "did"
  ) {
    Logger.error(
      `Invalid DID syntax. Given did = ${did} should be ${
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
};

const getAddressFromHexEncoded = (hexAddress) => {
  const address = cardanoSerialization.Address.from_bytes(
    Buffer.from(hexAddress, "hex")
  ).to_bech32();

  Logger.info(`Address from hex (${hexAddress}) = ${address}`);
  return address;
};

const getPublicKeyFromAddress = (bech32Address) => {
  const address = cardanoSerialization.Address.from_bech32(bech32Address);
  const publicKey = Buffer.from(address.to_bytes(), "hex").toString("hex");
  Logger.info(`Publickey from address ${bech32Address} is ${publicKey}`);
  return publicKey;
};

const validateJSONSchema = (rawSchema, object) => {
  const schema = (({ example, ...props }) => props)(rawSchema);

  const ajv = new Ajv();
  const validate = ajv.compile(schema);

  const valid = validate(object);
  if (!valid)
    Logger.error(`Invalid object.\n${JSON.stringify(validate.errors)}`);
  return valid ? { valid } : { valid, detail: validate.errors };
};

const checkUndefinedVar = (object) => {
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
};

const checkForSpecialChar = (strings) => {
  const specialChars = `\`!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~`;
  for (const index in strings) {
    let result = specialChars.split("").some((specialChar) => {
      if (strings[index].includes(specialChar)) {
        return true;
      }
      return false;
    });
    if (result) {
      return {
        valid: false,
        string: index,
      };
    }
  }
  return {
    valid: true,
  };
};

const isSameError = (obj, errorObj) => {
  return obj.error_code === errorObj.error_code &&
    obj.error_message === errorObj.error_message
    ? true
    : false;
};

const getCurrentAccount = ({ mnemonic }) => {
  const entropy = BIP39.mnemonicToEntropy(mnemonic);
  const rootKey = CardanoWasm.Bip32PrivateKey.from_bip39_entropy(
    Buffer.from(entropy, "hex"),
    Buffer.from("")
  );

  const harden = (num) => {
    return 0x80000000 + num;
  };

  const accountKey = rootKey
    .derive(harden(1852))
    .derive(harden(1815))
    .derive(harden(0));
  const paymentKey = accountKey.derive(0).derive(0).to_raw_key();
  const stakeKey = accountKey.derive(2).derive(0).to_raw_key();

  const publicKey = Buffer.from(accountKey.to_public().as_bytes()).toString(
    "hex"
  ); // BIP32 Public Key
  const paymentKeyPub = paymentKey.to_public();
  const stakeKeyPub = stakeKey.to_public();

  const paymentKeyHash = Buffer.from(
    paymentKeyPub.hash().to_bytes(),
    "hex"
  ).toString("hex");
  const stakeKeyHash = Buffer.from(
    stakeKeyPub.hash().to_bytes(),
    "hex"
  ).toString("hex");

  // Base address with Staking Key
  const paymentAddr = CardanoWasm.BaseAddress.new(
    process.env.CARDANO_NETWORK !== 1
      ? CardanoWasm.NetworkInfo.testnet().network_id()
      : CardanoWasm.NetworkInfo.mainnet().network_id(),
    CardanoWasm.StakeCredential.from_keyhash(paymentKeyPub.hash()),
    CardanoWasm.StakeCredential.from_keyhash(stakeKeyPub.hash())
  )
    .to_address()
    .to_bech32();

  // Enterprise address without staking ability, for use by exchanges/etc
  const enterpriseAddr = CardanoWasm.EnterpriseAddress.new(
    process.env.CARDANO_NETWORK !== 1
      ? CardanoWasm.NetworkInfo.testnet().network_id()
      : CardanoWasm.NetworkInfo.mainnet().network_id(),
    CardanoWasm.StakeCredential.from_keyhash(paymentKeyPub.hash())
  )
    .to_address()
    .to_bech32();

  return {
    rootKey: rootKey,
    accountKey: accountKey,
    paymentKey: paymentKey,
    paymentKeyPub: paymentKeyPub,
    paymentKeyHash: paymentKeyHash,
    stakeKey: stakeKey,
    paymentAddr: paymentAddr,
    enterpriseAddr: enterpriseAddr,
  };
};

export {
  validateDIDSyntax,
  getAddressFromHexEncoded,
  getPublicKeyFromAddress,
  validateJSONSchema,
  checkUndefinedVar,
  checkForSpecialChar,
  isSameError,
  getCurrentAccount,
};
