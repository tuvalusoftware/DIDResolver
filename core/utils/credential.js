// * Utilities
import { generateDid } from "../../fuixlabs-documentor/utils/did.js";

/**
 * Create credential to authenticate the exchange of document ownership between the owner and the holders
 * @param {String} issuerDid
 * @param {String} holderDid
 * @param {String} didoWrappedDocument
 * @param {Object} metadata
 * @param {Object} action - purpose of creating credential
 * @param {String} signature
 * @return {Object} - return a credential
 */
const createVerifiableCredential = async (
  { didoWrappedDocument, metadata, action },
  currentUserPublicKey,
  lucidClient,
  currentWallet
) => {
  const credentialSubject = {
    object: didoWrappedDocument,
    action: action,
  };
  const payload = {
    address: currentUserPublicKey,
    subject: credentialSubject,
  };
  try {
    const signMessage = await lucidClient
      ?.newMessage(
        currentWallet?.paymentAddr,
        Buffer.from(JSON.stringify(payload), "utf8").toString("hex")
      )
      .sign();
    const hexStringPayload = Buffer.from(
      JSON.stringify(payload),
      "utf8"
    ).toString("hex");
    const signedData = signMessage;
    let credential = {
      issuer: generateDid(process.env.COMPANY_NAME, currentUserPublicKey),
      credentialSubject,
      signature: signedData,
      metadata,
    };
    return { credential, payload: hexStringPayload, signature: signedData };
  } catch (e) {
    throw e;
  }
};

export { createVerifiableCredential };
