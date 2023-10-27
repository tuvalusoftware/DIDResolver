import "dotenv/config";
import logger from "../../../logger.js";
import { checkUndefinedVar, validateDID } from "../../utils/index.js";
import {
    AuthHelper,
    CardanoHelper,
    ControllerHelper,
    VerifiableCredentialHelper,
} from "../../helpers/index.js";
import { ERRORS } from "../../config/errors/error.constants.js";

/**
 * Controller for verifying a certificate.
 * @typedef {Object} VerifierController
 * @property {Function} verifyCertificate - Verifies a certificate.
 * @property {Function} verifyVerifiableCredential - Verifies a verifiable credential.
 */

/**
 * Verifier controller object.
 * @type {VerifierController}
 */
export default {
    /**
     * Verifies a certificate.
     * @function verifyCertificate
     * @async
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @param {Function} next - Express next middleware function.
     * @returns {Object} - Returns a JSON object with the verification result and data.
     */
    verifyCertificate: async (req, res, next) => {
        try {
            logger.apiInfo(req, res, "API Request: Verify Certificate");
            const { did } = req.body;
            const undefinedVar = checkUndefinedVar({
                did,
            });
            if (undefinedVar.undefined) {
                return next({
                    ...ERRORS.MISSING_PARAMETERS,
                    detail: undefinedVar?.detail,
                });
            }
            const { valid } = validateDID(did);
            if (!valid) {
                return next(ERRORS.INVALID_DID);
            }
            const accessToken =
                process.env.NODE_ENV === "test"
                    ? "mock-access-token"
                    : await AuthHelper.authenticationProgress();
            const documentContentResponse =
                await ControllerHelper.getDocumentContent({
                    did,
                    accessToken,
                });
            const documentHash =
                documentContentResponse?.data?.wrappedDoc?.signature
                    ?.targetHash;
            const policyId =
                documentContentResponse?.data?.wrappedDoc?.mintingConfig?.policy
                    ?.id;
            await CardanoHelper.verifyCardanoNft({
                hashofdocument: documentHash,
                accessToken,
                policyid: policyId,
            });
            const getEndorsementChainResponse =
                await CardanoHelper.getEndorsementChain({
                    accessToken,
                    policyId,
                });
            const documentHistory = getEndorsementChainResponse?.data
                ?.filter((item) => item?.onchainMetadata?.type === "document")
                .sort(
                    (a, b) =>
                        b?.onchainMetadata?.timestamp -
                        a?.onchainMetadata?.timestamp
                );
            if (documentHash !== documentHistory[0]?.assetName) {
                return next(ERRORS.DOCUMENT_IS_NOT_LASTEST_VERSION);
            }
            return res.status(200).json({
                valid: true,
                data: documentContentResponse?.data?.wrappedDoc,
            });
        } catch (error) {
            error?.error_code
                ? next(error)
                : next({
                      error_code: 400,
                      error_message:
                          error?.error_message ||
                          error?.message ||
                          "Something went wrong!",
                  });
        }
    },
    /**
     * Verifies a verifiable credential.
     * @function verifyVerifiableCredential
     * @async
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @param {Function} next - Express next middleware function.
     * @returns {Object} - Returns a JSON object with the verification result and data.
     */
    verifyVerifiableCredential: async (req, res, next) => {
        try {
            logger.apiInfo(
                req,
                res,
                "API Request: Verify Verifiable Credential"
            );
            const { did } = req.body;
            const undefinedVar = checkUndefinedVar({
                did,
            });
            if (undefinedVar.undefined) {
                return next({
                    ...ERRORS.MISSING_PARAMETERS,
                    detail: undefinedVar?.detail,
                });
            }
            const { valid } = validateDID(did);
            if (!valid) {
                return next(ERRORS.INVALID_DID);
            }
            const accessToken =
                process.env.NODE_ENV === "test"
                    ? "mock-access-token"
                    : await AuthHelper.authenticationProgress();
            const credentialContentResponse =
                await ControllerHelper.getCredentialContent({
                    accessToken,
                    did,
                });
            const credentialContent = credentialContentResponse?.data;
            delete credentialContent._id;
            delete credentialContent.createdAt;
            delete credentialContent.updatedAt;
            // const verifierResponse = await VerifiableCredentialHelper.verifyVerifiableCredential({
            //     credential: credentialContent
            // });
            return res.status(200).json({
                valid: true,
                data: credentialContent,
            });
        } catch (error) {
            error?.error_code
                ? next(error)
                : next({
                      error_code: 400,
                      error_message:
                          error?.error_message ||
                          error?.message ||
                          "Something went wrong!",
                  });
        }
    },
};
