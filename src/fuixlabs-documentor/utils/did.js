// * Constant libraries
import { DID_ERROR } from "../constants/error.js";
import { env } from "../../configs/constants.js";

// * Rest libraries
import {
    requestCreateUserDid,
    requestPublicKey,
    requestUpdateDid,
} from "../rest/client.rest.js";
import { CLIENT_PATH } from "../rest/client.path.js";

// * Utilities libraries
import { generateDidOfWrappedDocument } from "../utils/data.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * Function used to generate did rely on company name and encoded public key
 * @param {String} companyName - Company name
 * @param {String} publicKey - Public key
 * @return {String} - Did
 */
export const generateDid = (companyName, prop) => {
    const did = `did:${env.DEV_COMPANY_NAME}:${companyName}:${prop}`;
    return did;
};

/**
 * Function used to add new issuer
 * @param {String} usersDid
 * @param {String} companyName
 * @param {String} publicKey
 * @param {Object} data
 * @return {Promise}
 */
export const addNewIssuer = async (
    usersDid,
    companyName,
    publicKey,
    data,
    encoded = false,
    signedData = null,
    isIssuer = false
) => {
    try {
        if (!companyName || !publicKey || !data)
            throw DID_ERROR.MISSING_PARAMETERS;
        let createNewUserDidRes;
        let encodedPublicKey = publicKey;
        if (!encoded) {
            const publicKeyRes = await requestPublicKey(
                CLIENT_PATH.GET_PUBLIC_KEY,
                {
                    address: publicKey,
                    user: "owner",
                    confirmNominate: false,
                }
            );
            encodedPublicKey = publicKeyRes?.data?.publicKey;
        }
        let didContent = { ...data, address: encodedPublicKey };
        if (
            usersDid.filter((_did) => _did.name === encodedPublicKey).length ===
            0
        ) {
            createNewUserDidRes = await requestCreateUserDid(
                CLIENT_PATH.RETRIEVE_SPECIFIC_DID,
                {
                    companyName: companyName,
                    publicKey: encodedPublicKey,
                    data: didContent,
                    did: generateDidOfWrappedDocument(
                        process.env.COMPANY_NAME,
                        encodedPublicKey
                    ),
                }
            );
            if (createNewUserDidRes?.data?.error_code)
                throw createNewUserDidRes?.data;
        } else {
            const currentUserDid = usersDid.filter(
                (_did) => _did.name === encodedPublicKey
            )[0];
            let userDidData = Object.assign({}, currentUserDid?.content?.data);
            userDidData = Object.assign(userDidData, {
                issuer: isIssuer,
                signedData,
            });
            const updateUserDidRes = await requestUpdateDid(
                CLIENT_PATH.RETRIEVE_SPECIFIC_DID,
                {
                    companyName: companyName,
                    publicKey: encodedPublicKey,
                    data: userDidData,
                    did: generateDidOfWrappedDocument(
                        process.env.COMPANY_NAME,
                        encodedPublicKey
                    ),
                }
            );
            if (updateUserDidRes?.data?.error_code)
                throw updateUserDidRes?.data;
        }
    } catch (e) {
        throw e;
    }
};
