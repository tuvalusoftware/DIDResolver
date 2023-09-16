/* eslint-disable no-unused-vars */
import { Buffer } from "buffer";

// * Rest libraries
import {
  checkExistsDidoWrappedDoc,
  _pullNFTs,
  requestCreateCredential,
  requestPublicKey,
  sendWrappedDocument,
} from "../rest/client.rest.js";
import { CLIENT_PATH } from "../rest/client.path.js";

// * Constants libraries
import {
  SERVICE,
  IdentityProofType,
  VALID_DOCUMENT_NAME_TYPE,
  _DOCUMENT_TYPE,
} from "../constants/type.js";
import { VERIFIER_ERROR_CODE, CREDENTIAL_ERROR } from "../constants/error.js";

// * Utilities libraries
import { verifyCardanoDocument } from "./verifier.js";
import { digestDocument } from "./digest.js";
import { deepMap } from "../utils/salt.js";
import {
  _wrapDocument,
  _createDocument,
  generateDidOfWrappedDocument,
  unsalt,
} from "./data.js";
import { generateDid } from "./did.js";
import "dotenv/config";

const SAMPLE_SERVICE = "cardano";

/**
 * Create wrapped document rely on javascript object, service, current user wallet address and did
 * @param {object} document - Document to wrap
 * @param {string} service - Service name
 * @param {string} walletAddress - Current user wallet address
 * @param {string} did - Current user did
 * @return {Promise}
 */
export const createWrappedDocument = async (
  document,
  service,
  walletAddress,
  did
) => {
  let { fileName, companyName } = document;
  // Init identityProof
  let identityProofType = {
    type: "",
  };
  if (!document || !fileName || !companyName || !did) {
    const newLocal = false;
    throw newLocal;
  }
  try {
    // Send GET request to controller to check whether the DID_Document exist
    // const response = await checkExistsDidoWrappedDoc(
    //   CLIENT_PATH.CHECK_DID_OF_WRAPPED_DOCUMENT,
    //   {
    //     companyName,
    //     fileName: fileName,
    //   }
    // );
    // const isExisted = response.data;
    //Get the existed condition of DID_Document
    // const isExisted = response?.data?.isExisted;
    if (true) {
      if (service === SERVICE.CARDANO) {
        // If service is cardano service, the identityProofType will be DID and create new field is did
        const identityProofDid = {
          did: did,
        };
        identityProofType.type = IdentityProofType.Did;
        identityProofType = { ...identityProofType, ...identityProofDid };
      } else if (service === SERVICE.ETHERIUM) {
        const identityProofLocation = {
          location: "weird-coffee-shrew.sandbox.openattestation.com", //Example location
        };
        identityProofType.type = SERVICE.ETHERIUM;
        identityProofType = { ...identityProofType, ...identityProofLocation };
      }
      // Init the information if the issuers includes: identityProofType, tokenRegistry, and the wallet-address (public-key)
      const issuers = [
        {
          identityProofType,
          address: walletAddress,
        },
      ];

      // Generate new DID_Document
      const ddidDocument = generateDidOfWrappedDocument(companyName, fileName);
      // Put did of wrapped document into document.data
      const data = { ...document, did: ddidDocument, issuers };
      // Create wrapped document
      const _document = _createDocument(data);
      // Generate target-hash
      const digest = digestDocument(_document);
      // Init the structure of salted data
      const res = {
        _document: _document,
        targetHash: digest,
        ddidDocument: ddidDocument,
      };
      return res;
    }
    throw VERIFIER_ERROR_CODE.EXIST_FILE_NAME;
  } catch (e) {
    throw e;
  }
};

export const createDocuments = async (
  documents,
  usedAddress,
  update,
  updateDocument
) => {
  try {
    for (let index = 0; index < documents.length; index++) {
      let document = documents[index];
      document = deepMap(document, unsalt);
      let createdDocument = {};
      for (const key in document) {
        if (key !== "did")
          createdDocument = Object.assign(createdDocument, {
            [key]: document[key],
          });
      }
      createdDocument = Object.assign(createdDocument, {
        companyName: process.env.COMPANY_NAME,
        // * Get type rely on name of document in config file
        intention: VALID_DOCUMENT_NAME_TYPE.find(
          (prop) => prop.name === createdDocument.name
        ).type,
      });

      const did = document["did"]; // Did of issuers
      // * Create new document, generate did of wrapped-document rely on file name and company name, and create target-hash based on data of the document
      try {
        let res = await createWrappedDocument(
          createdDocument,
          SAMPLE_SERVICE,
          usedAddress,
          did
        );
        if (res.error_code) {
          throw res;
        }

        const { _document, targetHash, ddidDocument } = res;
        const signedData = await signObject(usedAddress, {
          address: usedAddress,
          targetHash: targetHash,
        });
        const response = wrapDocument({
          document: _document,
          walletAddress: usedAddress,
          signedData: signedData,
          targetHash: targetHash,
        });
        // * Get the wrapped document
        const wrappedDocument = response;
        let requestBody = {
          wrappedDocument: wrappedDocument,
          issuerAddress: usedAddress,
          did: ddidDocument,
        };
        // * If the type of document is non-trade, then make a new document with new policy id, otherwise, make a copy of current document with the same policy id
        if (
          update &&
          unsalt(wrappedDocument.data.intention) === _DOCUMENT_TYPE.nonTrade
        )
          requestBody = {
            ...requestBody,
            previousHashOfDocument: updateDocument.targetHash,
            originPolicyId: updateDocument.policyId,
          };
        await sendWrappedDocument(
          CLIENT_PATH.SEND_WRAPPED_DOCUMENT,
          requestBody
        ); // **
      } catch (e) {
        return;
      }
    }
  } catch (e) {
    throw e;
  }
};

/**
 * Wrap document rely on javascript object
 * @param {object} document - Document to wrap
 * @return {Object} wrapped document
 */
export const wrapDocument = (data) => {
  // * Get and check the input parameters
  const { document, signedData, targetHash } = data;
  const wrappedDocument = _wrapDocument(document, signedData, targetHash);
  return wrappedDocument;
};

export const _verifyDocument = async (document, address, service) => {
  // * Check the validity of the args
  if (!document || !service || !address) {
    return VERIFIER_ERROR_CODE.INVALID_PARAMETER;
  }

  // Distinguishing cases of verify wrapped document based on service - example: eth, cardano
  if (service !== SERVICE.CARDANO) {
    // * Skip it for demo
  } else {
    try {
      const res = await verifyCardanoDocument(document, address);
      // * If the wrappedDocument is valid will return true
      return res;
    } catch (e) {
      throw e;
    }
  }
};

/**
 * Process and pull all nfts rely on policy-id from cardano-service
 * @param {String} policyId - example: '1050dd64e77e671a0fee81f391080f5f57fefba2e26a816019aa5524'
 * @param {Promise}
 */
export const pullNFTs = async (policyId) => {
  if (!policyId) return VERIFIER_ERROR_CODE.MISSING_PARAMETERS;
  try {
    const data = {
      policyId: policyId,
    };
    const res = await _pullNFTs(CLIENT_PATH.PULL_NFTS, data);
    if (res.data.error_code) return res.data;
    if (res.data.data.nfts) {
      return {
        nfts: res.data.data.nfts,
      };
    }
    throw VERIFIER_ERROR_CODE.CANNOT_GET_NFTS;
  } catch (e) {
    throw e;
  }
};

/**
 * Sign Object through signing function of cardano with public-key
 * @param {String} publicKey
 * @param {Object} data
 * @return {Promise}
 */
export const signObject = async (
  currentWallet,
  publicKey,
  data,
  fuixlabsWalletors
) => {
  if (fuixlabsWalletors)
    return await fuixlabsWalletors(
      publicKey,
      Buffer.from(JSON.stringify(data), "utf8").toString("hex")
    );
  return await currentWallet.signData(
    publicKey,
    Buffer.from(JSON.stringify(data), "utf8").toString("hex")
  );
};

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
export const createCredential = async (
  { currentWallet, dids, didoWrappedDocument, metadata, action },
  currentUserPublicKey
) => {
  if (!dids || !didoWrappedDocument || !action || !currentWallet)
    return CREDENTIAL_ERROR.INVALID_PARAMETER;
  let transferObject = {};
  // eslint-disable-next-line array-callback-return
  action.fields.map((prop) => {
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
    const signedData = await signObject(
      currentWallet,
      currentUserPublicKey,
      payload
    );
    // * Convert payload object to hex string
    const hexStringPayload = Buffer.from(
      JSON.stringify(payload),
      "utf8"
    ).toString("hex");

    let credential = {
      issuer: generateDid(process.env.COMPANY_NAME, currentUserPublicKey),
      credentialSubject,
      signature: signedData,
      metadata,
    };
    return { credential, payload: hexStringPayload, signature: signedData };
  } catch (e) {
    throw CREDENTIAL_ERROR.CANNOT_SIGN_OBJECT;
  }
};

/**
 * @param {Object} props
 * @param {String} currentUserPublicKey - the public-key of current user
 * @return {Promise}
 */
export const changeHoldership = async (currentUserPublicKey, args) => {
  const {
    didoWrappedDocument,
    keys,
    action,
    config,
    confirmNominate,
    metadata,
  } = args;
  if (!didoWrappedDocument || !currentUserPublicKey || !keys || !action)
    return VERIFIER_ERROR_CODE.INVALID_PARAMETER;
  const isSurrender = action.surrender;
  try {
    let dids = {
      issuerKey: generateDid(process.env.COMPANY_NAME, currentUserPublicKey),
    };
    let publicKey = null,
      updateUser = null;
    // * If the action is deferent from surrendering document, request to encoded public key from resolver
    if (!isSurrender) {
      let requestResult;
      let transferPerson = "ownerKey";
      if (!confirmNominate) {
        requestResult = await requestPublicKey(CLIENT_PATH.GET_PUBLIC_KEY, {
          address: keys[action.updatedFieds[0].name],
          user: action.updatedFieds[0].name,
          confirmNominate: confirmNominate,
        });
        transferPerson = requestResult.data.user;
      }
      dids = {
        ...dids,
        [transferPerson]: generateDid(
          process.env.COMPANY_NAME,
          requestResult?.data ? requestResult?.data?.publicKey : null
        ),
      };
      publicKey = confirmNominate
        ? keys[action.updatedFieds[0].name]
        : requestResult?.data
        ? requestResult?.data?.publicKey
        : null;
      updateUser = action.updatedFieds[0].name;
    }
    const props = {
      ...args,
      dids,
      metadata: {
        ...metadata,
      },
    };
    // * Create transferable credential depended on action type
    const result = await createCredential(props, currentUserPublicKey);
    if (action.code === 20)
      if (result.error_code) throw CREDENTIAL_ERROR.CANNOT_CREATE_CREDENTIAL; // * In this case, return the error code object
    const { credential, signature, payload } = result;
    // * Init the body of request
    const bodyData = {
      did: didoWrappedDocument,
      address: currentUserPublicKey,
      credential:
        action.code === 20
          ? {
              ...credential,
              CREDENTIAL_ERRORtimestamp: Date.now(),
              status: "pending",
            }
          : { ...credential, timestamp: Date.now() },
      payload: payload,
      signature: signature,
      config: config,
    };
    const createResponse = await requestCreateCredential(
      CLIENT_PATH.CREATE_CREDENTIAL,
      bodyData
    );
    if (createResponse.error_code) throw createResponse;
    return {
      data: createResponse.data,
      user: updateUser,
      publicKey: publicKey,
      surrender: isSurrender,
    };
  } catch (e) {
    throw e;
  }
};

/**
 * @param {Object} originDidDoc - the did-document of updated document got from DIDController before transfering
 * @param {String} newOwner - the encoded publickey of new owner
 * @param {String} newHolder - the encoded publickey of new holder
 * @return {Object} new Did Document
 */
export const updateDidDocument = (originDidDoc, newOwner, newHolder) => {
  let newDidDoc = { ...originDidDoc };
  newDidDoc.controller[0] = newOwner;
  newDidDoc.controller[1] = newHolder;
  newDidDoc.owner = newOwner;
  newDidDoc.holder = newHolder;
  return newDidDoc;
};

/**
 * @param {Object} originDidDoc - the did-document of updated document got from DIDController before transfering
 * @return {Object} new Did Document
 */
export const makeNullDidDocument = (originDidDoc) => {
  const newDidDoc = { ...originDidDoc };
  newDidDoc.controller = null;
  return newDidDoc;
};
