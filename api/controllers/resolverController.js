// const { response } = require("express");
const axios = require("axios").default;
const DID_CONTROLLER = "http://localhost:8080";
const CARDANO_SERVICE = "http://localhost";

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
        const publicKey = didComponents[3];
        const response = await axios.post(DID_CONTROLLER + "/api/did/", {
            companyName: companyName,
            publicKey: publicKey,
            content: didDocument
        });

        return res.status(201).json(response.data);
    }
    catch (err) {
        return res.status(400).json(err.response.data);
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
        const response = await axios.get(DID_CONTROLLER + "/api/did/", {
            headers: {
                companyName: companyName,
                fileName: fileName
            }
        });

        return res.status(200).json(response.data);
    }
    catch (err) {
        return res.status(400).json(err.response.data);
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
    
    const did = wrappedDocument.ddidDocument,
         didComponents = did.split(":");
    if (didComponents.length < 4 || didComponents[0] != "did") 
        return res.status(400).send("Invalid DID syntax.");

    const companyName = didComponents[2], 
        fileName = didComponents[3],
        address = wrappedDocument.data.issuers[0].address,
        targetHash = wrappedDocument.signature.targetHash;

    try {
        await axios.post(DID_CONTROLLER + "/api/doc-exists/", {
           companyName: companyName,
           fileName: fileName
        })
        .then(function(response) {
            if (response.data.data.isExisted) {
                return res.status(400).send("File name existed");
            }
            else {
                axios.put(CARDANO_SERVICE + "/api/storeHash/", {
                    address: address,
                    hash: targetHash
                })
                .then(function(response) {
                    const storingHash = response.data;
                    console.log(storingHash);
                    // const storingHash = true;
                    if (!storingHash) 
                        return res.status(400).send("Cannot store hash");
                    else {
                        axios.post(DID_CONTROLLER + "/api/doc/", {
                            fileName: fileName,
                            wrappedDocument: wrappedDocument,
                            companyName: companyName
                        })
                        .then(function(response) {
                            console.log("Stored data");
                            return res.status(200).json(response.data);
                        })
                        .catch(function(error) {
                            return res.status(400).json(error);
                        });
                    }
                })
                .catch(function(error) {
                    console.log(error);
                    return res.status(400).json(error);
                });
            }
        });
    }
    catch (err) {
        console.log(err);
        return res.status(400).json(err.response.data);
    }
}