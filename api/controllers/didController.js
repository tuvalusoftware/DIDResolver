const axios = require("axios").default;
const { ERRORS, SERVERS } = require("../../core/constants");
const { checkUndefinedVar, checkForSpecialChar } = require("../../core/index");
const Logger = require("../../logger");

axios.defaults.withCredentials = true;

module.exports = {
    retrieveUserDid: async function (req, res) {
        const { access_token } = req.cookies;
        const { companyName, publicKey } = req.query;

        try {
            // Validate input
            const undefinedVar = checkUndefinedVar({
                companyName,
                publicKey,
            });
            if (undefinedVar.undefined)
                return res.status(200).json({
                    ...ERRORS.MISSING_PARAMETERS,
                    detail: undefinedVar.detail,
                });

            const specialVar = checkForSpecialChar({ companyName, publicKey });
            if (!specialVar?.valid) {
                return res.status(200).json({
                    ...ERRORS.INVALID_STRING,
                    detail: specialVar?.string || "",
                });
            }

            // Call DID Controller
            const userDid = await axios.get(
                SERVERS.DID_CONTROLLER + "/api/did",
                {
                    withCredentials: true,
                    headers: {
                        Cookie: `access_token=${access_token};`,
                    },
                    params: {
                        companyName,
                        publicKey,
                    },
                }
            );

            // Check for any error from DID Controller
            if (userDid?.data?.error_code) {
                Logger.apiError(req, res, `${JSON.stringify(userDid.data)}`);
            }

            return res.status(200).send(userDid.data);
        } catch (e) {
            e.response
                ? res.status(400).json(e.response.data)
                : res.status(400).json(e);
        }
    },
    retrieveAllUsersDid: async function (req, res) {
        const { access_token } = req.cookies;
        const { companyName } = req.query;

        try {
            // Validate input
            const undefinedVar = checkUndefinedVar({
                companyName,
            });
            if (undefinedVar.undefined)
                return res.status(200).json({
                    ...ERRORS.MISSING_PARAMETERS,
                    detail: undefinedVar.detail,
                });

            const specialVar = checkForSpecialChar({ companyName });
            if (!specialVar?.valid) {
                return res.status(200).json({
                    ...ERRORS.INVALID_STRING,
                    detail: specialVar?.string || "",
                });
            }

            // Retrieve data from DID Controller
            const usersDid = await axios.get(
                SERVERS.DID_CONTROLLER + "/api/did/all",
                {
                    withCredentials: true,
                    headers: {
                        Cookie: `access_token=${access_token};`,
                    },
                    params: {
                        companyName,
                        content: "include",
                    },
                }
            );

            if (usersDid?.data?.error_code) {
                Logger.apiError(req, res, `${JSON.stringify(usersDid.data)}`);
                return res.status(200).send(usersDid?.data);
            }

            return res.status(200).send(usersDid.data);
        } catch (e) {
            e.response
                ? res.status(400).json(e.response.data)
                : res.status(400).json(e);
        }
    },
    createUserDid: async function (req, res) {
        const { access_token } = req.cookies;
        const { companyName, publicKey, data, did } = req.body;

        try {
            // Validate input
            const undefinedVar = checkUndefinedVar({
                companyName,
                publicKey,
                data,
                did,
            });

            if (undefinedVar.undefined)
                return res.status(200).json({
                    ...ERRORS.MISSING_PARAMETERS,
                    detail: undefinedVar.detail,
                });
            const requestBody = {
                companyName,
                publicKey,
                content: {
                    controller: publicKey,
                    did: did,
                    data: data,
                },
            };
            const createUserDidReq = await axios.post(
                SERVERS.DID_CONTROLLER + "/api/did",
                requestBody,
                {
                    withCredentials: true,
                    headers: {
                        Cookie: `access_token=${access_token};`,
                    },
                }
            );
            if (createUserDidReq?.data?.error_code) {
                Logger.apiError(
                    req,
                    res,
                    `${JSON.stringify(createUserDidReq?.data)}`
                );
            }
            return res.status(200).send(createUserDidReq?.data);
        } catch (e) {
            e.response
                ? res.status(400).json(e.response.data)
                : res.status(400).json(e);
        }
    },
    updateUserDid: async function (req, res) {
        const { access_token } = req.cookies;
        const { companyName, publicKey, data, did } = req.body;
        try {
            const undefinedVar = checkUndefinedVar({
                companyName,
                publicKey,
                data,
                did,
            });
            if (undefinedVar.undefined)
                return res.status(200).json({
                    ...ERRORS.MISSING_PARAMETERS,
                    detail: undefinedVar.detail,
                });
            const requestBody = {
                companyName,
                publicKey,
                content: {
                    controller: publicKey,
                    did: did,
                    data: data,
                },
            };
            const createUserDidReq = await axios.put(
                SERVERS.DID_CONTROLLER + "/api/did",
                requestBody,
                {
                    withCredentials: true,
                    headers: {
                        Cookie: `access_token=${access_token};`,
                    },
                }
            );
            if (createUserDidReq?.data?.error_code) {
                Logger.apiError(
                    req,
                    res,
                    `${JSON.stringify(createUserDidReq?.data)}`
                );
            }
            return res.status(200).send(createUserDidReq?.data);
        } catch (e) {
            e.response
                ? res.status(400).json(e.response.data)
                : res.status(400).json(e);
        }
    },
    deleteUserDid: async function (req, res) {
        const { access_token } = req.cookies;
        const { companyName, publicKey } = req.body;
        try {
            const undefinedVar = checkUndefinedVar({
                companyName,
                publicKey,
            });
            if (undefinedVar.undefined)
                return res.status(200).json({
                    ...ERRORS.MISSING_PARAMETERS,
                    detail: undefinedVar.detail,
                });

            const specialVar = checkForSpecialChar({ companyName, publicKey });
            if (!specialVar?.valid) {
                return res.status(200).json({
                    ...ERRORS.INVALID_STRING,
                    detail: specialVar?.string || "",
                });
            }

            const deleteUserDidRes = await axios.delete(
                SERVERS.DID_CONTROLLER + "/api/did",
                {
                    withCredentials: true,
                    headers: {
                        Cookie: `access_token=${access_token};`,
                    },
                    params: {
                        companyName: companyName,
                        publicKey: publicKey,
                    },
                }
            );
            if (deleteUserDidRes?.data?.error_code) {
                Logger.apiError(
                    req,
                    res,
                    `${JSON.stringify(deleteUserDidRes?.data)}`
                );
            }
            return res.status(200).send(deleteUserDidRes?.data);
        } catch (e) {
            e.response
                ? res.status(400).json(e.response.data)
                : res.status(400).json(e);
        }
    },
};
