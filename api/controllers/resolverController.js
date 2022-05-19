const { response } = require("express");

const FormData = require("form-data");
const axios = require("axios").default;

/**
 * POST to create DID Doc for a DID
 * @param {userDid} userDid DID string of user/company. Syntax did:tradetrust:<companyName>
 * @param {file} file file 
 * @returns {Object} DID Document of DID
 */
// exports.createDidDoc = async function (req, res) {
//     const { userDid, file } = req.body;

    
//     try {
//         const didComponents = userDid.split(":");
//         if (didComponents.length != 3 || didComponents[0] != "did")
//             return res.status(400).json("Wrong input!");
        
//         const companyName = didComponents[2];
//         const response = await axios.post("http://localhost:8080/new-did/", {
//             body: {
//                 companyName: companyName,
//                 fileName: fileName,
//                 content: {}
//             }
//         })
//         .then(function(response) {
//             return response;
//         })
//         .catch(function(error) {
//             return res.status(400).json(error);
//         })
//     }
//     catch (err) {
//         console.log(err);
//         return res.status(400).json(err);
//     }
// }


/**
 * GET request to resolve DID
 * @param {String} did syntax is did:tradetrust:<companyName>:<documentName>:<somehash>
 * @returns {Object} DID Document of DID
 */
exports.getDidDoc = async function(req, res) {
    const { did } = req.headers;
    console.log(did);
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
 * POST to create document
 * @param {did} userDid DID string of user/company. Syntax did:tradetrust:<companyName>
 * @param {file} file document file 
 * @returns {Object} DID Document of DID
 */
exports.createDocument = async function(req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send("No files were uploaded.");
    }
    
    const { did } = req.body;
    const document = req.files.file;  
    if (!did || !document)
        return res.status(400).send("Missing parameters.");

    const didComponents = did.split(":");
    if (didComponents.length < 3 || didComponents[0] != "did") 
        return res.status(400).send("Invalid DID syntax.");

    try {
        const companyName = didComponents[2];
        var formData = new FormData();
        formData.append("document", document);
        formData.append("comanyName", companyName);
        console.log(formData);
        const response = await axios.post("http://localhost:8080/api/doc/", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
            // body: {
            //     companyName: companyName,
            //     // document: document
            // }
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
        return res.status(200).json(err);
    }
}


// Create Image