// const { response } = require("express");

const axios = require("axios").default;
const { parseCookies, ensureAuthenticated } = require("../../core/index");
const DID_CONTROLLER = "http://localhost:8000";
const CARDANO_SERVICE = "http://localhost:10000";
const AUTHENTICATION_SERVICE = "http://localhost:12000";

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
 * @param {String} did syntax is did:tradetrust:<companyName>:<documentName>
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
    .catch((error) => (error.response) ? res.status(404).json(error.response.data) : res.status(400).json(error));
}

exports.checkWrappedDocumentExistence = async function(req, res) {
    const { fileName, companyName } = req.body;
    console.log(req.body);
    if (!fileName || !companyName) 
        return res.status(400).send("Missing parameters.");

    await axios.get(DID_CONTROLLER + "/api/doc/exists/", {
        headers: {
            fileName, companyName
        }
    })
    .then((existence) => res.status(200).json(existence.data.isExisted))
    .catch((error) => (error.response) ? res.status(400).json(error.response.data) : res.status(400).json(error)); 
}

/**
 * POST to creat wrapped document
 * @param {Object} wrappedDocument JSON object wrapped document, including did, hash and address.
 * @returns {JSON} message
 */
exports.createWrappedDocument = async function(req, res) {
    const cookies = parseCookies(req);
    console.log(cookies.access_token);

    const { wrappedDocument } = req.body;
    if (!wrappedDocument || !wrappedDocument.data.ddidDocument || !cookies.access_token)
        return res.status(400).send("Missing parameters.");
    
    const access_token = cookies.access_token,
        did = wrappedDocument.data.ddidDocument,
        didComponents = did.split(":");
    if (didComponents.length < 6) 
        return res.status(400).send("Invalid DID syntax.");

    const companyName = didComponents[4], 
        fileName = didComponents[5],
        issuerAddress = wrappedDocument.data.issuers[0].address,
        targetHash = wrappedDocument.signature.targetHash;

    try {
        const address = await axios.get(AUTHENTICATION_SERVICE + "/api/auth/verify", {
            withCredentials: true,
            headers: {
                "Cookie": `access_token=${access_token};`,
            }
        });

        if (address !== issuerAddress) 
            return res.status(401).send("Unauthorized");
        
        const existence = await axios.get(DID_CONTROLLER + "/api/doc/exists/", {
            headers: {
                companyName, 
                fileName
            }
        });
        if (existence.data.isExisted) 
            return res.status(400).send("File name exsited");
        
        const storingHash = await axios.put(CARDANO_SERVICE + "/api/storeHash/", {
            address,
            hash: targetHash
        });
        const storingHashStatus = storingHash.data.result;
        if (storingHashStatus !== "true")
            return res.status(400).send(storingHashStatus, ". Cannot store hash.");
        
        const storingWrappedDocumentStatus = await axios.post(DID_CONTROLLER = "/api/docs", {
            fileName, wrappedDocument, companyName    
        });
        console.log(storingWrappedDocumentStatus.data);
        return res.status(200).json(storingWrappedDocumentStatus.data);
    }
    catch (err) {
        return (err.response) ? res.status(400).json(error.response.data) : res.status(400).json(err);
    }
}