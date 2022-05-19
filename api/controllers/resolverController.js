const { response } = require("express");
const axios = require("axios").default;

/**
 * POST to create DID Doc for a DID
 * @param {String} did DID string of user/company. Syntax did:tradetrust:<companyName>
 * @param {Object} file file 
 * @returns {Object} DID Document of DID
 */
exports.createDIDDocument = async function (req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send("No files were uploaded.");
    }

    const { did } = req.body;
    const file = req.files.file;
    if (!did || !file)
        return res.status(400).send("Missing parameters.");

    const didComponents = did.split(":");
    if (didComponents.length != 3 || didComponents[0] != "did")
            return res.status(400).json("Invalid DID syntax.");
    
    try {
        const companyName = didComponents[2];
        const fileName = file.name;
        const response = await axios.post("http://localhost:8080/new-did/", {
            body: {
                companyName: companyName,
                fileName: fileName,
                content: {}
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
        console.log(err);
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
        const response = await axios.get("http://localhost:8080/api/get-did/", {
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
        })

        return res.status(200).json(response.data);
    }
    catch (err) {
        return res.status(400).json(err);
    }
}


/**
 * POST to creat wrapped document
 * @param {String} did DID string of user/company. Syntax did:tradetrust:<companyName>
 * @param {Object} file JSON object wrapped document
 * @returns {JSON} message
 */
exports.createWrappedDocument = async function(req, res) {
    console.log(req.body);
    const { did, wrappedDocument } = req.body;  
    if (!did || !wrappedDocument)
        return res.status(400).send("Missing parameters.");

    const didComponents = did.split(":");
    if (didComponents.length < 3 || didComponents[0] != "did") 
        return res.status(400).send("Invalid DID syntax.");
    console.log(wrappedDocument);
    
    try {
        const companyName = didComponents[2];
        const response = await axios.post("http://localhost:8080/api/doc/", {
            companyName: companyName,
            wrappedDocument: wrappedDocument
        })
        .then (function(response) {
            return response;
        })
        .catch(function(error) {
            return res.status(200).json(error);
        });

        return res.status(400).json(response.data);
    }
    catch (err) {
        return res.status(400).json(err);
    }
}