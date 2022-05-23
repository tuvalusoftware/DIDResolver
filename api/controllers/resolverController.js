// const { response } = require("express");
const axios = require("axios").default;
const DID_CONTROLLER = "http://localhost:8080";
const CARDANO_SERVICE = "http://localhost:8000";

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
    
    try {
        const companyName = didComponents[2];
        const publicKey = file.name;
        const response = await axios.post(DID_CONTROLLER + "/new-did/", {
            body: {
                companyName: companyName,
                fileName: publicKey,
                content: didDocument
            }
        })
        .then(function(response) {
            return response;
        })
        .catch(function(error) {
            return res.status(400).json(error);
        })
    }
    catch (err) {
        return res.status(400).json(err);
    }
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

    try {
        const companyName = didComponents[2];
        const fileName = didComponents[3];
        const response = await axios.get(DID_CONTROLLER + "/api/get-did/", {
            headers: {
                companyName: companyName,
                fileName: fileName
            }
        })
        .then(function(response) {
            return response;
        })
        .catch(function(error) {
            return res.status(400).json(error);
        });

        return res.status(200).json(response.data);
    }
    catch (err) {
        return res.status(400).json(err);
    }
}

/**
 * POST to creat wrapped document
 * @param {Object} wrappedDocument JSON object wrapped document, including did, hash and address.
 * @returns {JSON} message
 */
exports.createWrappedDocument = async function(req, res) {
    const { wrappedDocument } = req.body;  
    if (!wrappedDocument || !wrappedDocument.ddidDocument) // did:tradetrust:companyName:fileName
        return res.status(400).send("Missing parameters.");
    const did = wrappedDocument.ddidDocument;

    const didComponents = did.split(":");
    if (didComponents.length < 4 || didComponents[0] != "did") 
        return res.status(400).send("Invalid DID syntax.");
    
    try {
        const companyName = didComponents[2];
        const fileName = didComponents[3];

        const existedName = await axios.post(DID_CONTROLLER + "/api/doc-exists/", {
           companyName: companyName,
           fileName: fileName
        })
        .then(function(response) {
            return response.data.data.isExisted;
        })
        .catch(function(error) {
            return res.status(400).json(error);
        });

        if (existedName == true)
            return res.status(400).send("File name existed");
        else {
            // call Khang API
            const storingHash = true;
            if (!storingHash) 
                return res.status(400).send("Cannot store hash");
            else {
                // call Bao API to store
                return res.status(200).send("Stored wrapped document");
            }
        }
    }
    catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
}