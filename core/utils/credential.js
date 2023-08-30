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
  { dids, didoWrappedDocument, metadata, action },
  currentUserPublicKey
) => {
  const _action = ACTIONS_IDENTITY.find((_action) => _action === action);
  if (!_action) return CREDENTIAL_ERROR.INVALID_ACTION;

  let transferObject = {};
  // eslint-disable-next-line array-callback-return
  _action.fields.map((prop) => {
    transferObject = { ...transferObject, [prop.name]: dids[prop.value] };
  });
  const credentialSubject = {
    ...transferObject,
    object: didoWrappedDocument,
    action: action,
  };
  const payload = {
    address: currentUserPublicKey, // * Get the address of the issuer
    subject: credentialSubject,
  };
  try {
    const signedData = await signObject(currentUserPublicKey, payload);
    // * Convert payload object to hex string
    const hexStringPayload = Buffer.from(
      JSON.stringify(payload),
      "utf8"
    ).toString("hex");

    let credential = {
      issuer: generateDid(COMPANY_NAME, currentUserPublicKey),
      credentialSubject,
      signature: signedData,
      metadata,
    };
    return { credential, payload: hexStringPayload, signature: signedData };
  } catch (e) {
    throw CREDENTIAL_ERROR.CANNOT_SIGN_OBJECT;
  }
};

export { createVerifiableCredential };
