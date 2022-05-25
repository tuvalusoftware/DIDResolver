const { response } = require("express");

const axios = require("axios").default;
const DID_CONTROLLER = "http://localhost:9000";
const CARDANO_SERVICE = "http://192.168.1.23:10000";

/**
 * POST to create DID Doc for a DID
 * @param {String} did DID string of user/company. Syntax did:tradetrust:<companyName>:<publicKey>
 * @param {Object} didDocument JSON object is a DID Document
 * @returns {Object} DID Document of DID
 */
exports.createDIDDocument = async function (req, res) {
    const { did, didDocument } = req.body;
    if (!did || !didDocument)
        return res.status(400).send("Missing parameters.");

    const didComponents = did.split(":");
    if (didComponents.length < 4 || didComponents[0] != "did")
        return res.status(400).json("Invalid DID syntax.");

    const companyName = didComponents[2];
    const publicKey = didComponents[3];
    await axios.post(DID_CONTROLLER + "/api/did/", {
        companyName: companyName,
        publicKey: publicKey,
        content: didDocument
    })
    .then((response) => res.status(201).json(response.data))
    .catch((error) => res.status(400).json(error.response.data));
}


/**
 * GET request to resolve DID
 * @param {String} did syntax is did:tradetrust:<companyName>:<documentName>:<somehash>
 * @returns {Object} DID Document of DID
 */
exports.getDIDDocument = async function(req, res) {
    const { did } = req.headers;
    if (!did)
        return res.status(400).send("Missing parameters.");

    const didComponents = did.split(":");
    if (didComponents.length < 4 || didComponents[0] != "did")
        return res.status(400).send("Invalid DID syntax.");

    const companyName = didComponents[2];
    const fileName = didComponents[3];
    await axios.get(DID_CONTROLLER + "/api/did/", {
        headers: {
            companyName: companyName,
            fileName: fileName
        }
    })
    .then((response) => res.status(200).json(response.data))
    .catch((error) => res.status(400).json(error.response.data));
}

/**
 * POST to creat wrapped document
 * @param {Object} wrappedDocument JSON object wrapped document, including did, hash and address.
 * @returns {JSON} message
 */
exports.createWrappedDocument = async function(req, res) {
    const { wrappedDocument } = req.body;  
    console.log(req.body);
    if (!wrappedDocument || !wrappedDocument.ddidDocument) {
        console.log(1);
        return res.status(200).send("Missing parameters.");

    }
     // did:tradetrust:companyName:fileName
    
    const did = wrappedDocument.ddidDocument,
         didComponents = did.split(":");
    if (didComponents.length < 4 || didComponents[0] != "did") {
        console.log("idjasdas")
        return res.status(200).send("Invalid DID syntax.");
    }

    const companyName = didComponents[2], 
        fileName = didComponents[3],
        address = wrappedDocument.data.issuers[0].address,
        targetHash = wrappedDocument.signature.proof[0].signature;

    console.log(address, targetHash);

    await axios.get(DID_CONTROLLER + "/api/doc-exists/", {
        headers: {
            companyName: companyName,
            fileName: fileName
        }
    })
    .then((existence) => {
        if (existence.data.isExisted) 
            return res.status(400).send("File name existed");
        else {
            // CALL CARDANO SERVICE
            const status = "true";
            console.log(status);
            (status !== "true") ? res.status(400).send( status, ". Cannot store hash") :
                axios.post(DID_CONTROLLER + "/api/doc/", {
                    fileName,
                    wrappedDocument,
                    companyName
                })
                .then((storingWrappedDocumentStatus) => {
                    console.log("Stored data");
                    return res.status(200).json(storingWrappedDocumentStatus.data);
                })
                .catch((error) => {
                    console.log("ERROR WHEN STORING WRAPPED DOCUMENT");
                    return (error.response) ? res.status(400).json(error.response.data) : res.status(400).json(error);
                });
            }
    })
    .catch((error) => {
        console.log("ERROR WHEN CHECKING EXISTANCE");
        return (error.response) ? res.status(400).json(error.response.data) : res.status(400).json(error);
    });
}
