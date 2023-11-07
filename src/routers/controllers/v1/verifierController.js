import "dotenv/config";
import logger from "../../../../logger.js";
import { checkUndefinedVar, validateDID } from "../../../utils/index.js";
import { ERRORS } from "../../../configs/errors/error.constants.js";
import { handleServerError } from "../../../configs/errors/errorHandler.js";
import ControllerService from "../../../services/Controller.service.js";
import AuthenticationService from "../../../services/Authentication.service.js";
import CardanoService from "../../../services/Cardano.service.js";

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
                    : await AuthenticationService().authenticationProgress();
            const documentContentResponse = await ControllerService(
                accessToken
            ).getDocumentContent({
                did,
            });
            const documentHash =
                documentContentResponse?.data?.wrappedDoc?.signature
                    ?.targetHash;
            const policyId =
                documentContentResponse?.data?.wrappedDoc?.mintingConfig?.policy
                    ?.id;
            await CardanoService(accessToken).verifyCardanoNft({
                hashofdocument: documentHash,
                policyid: policyId,
            });
            const getEndorsementChainResponse = await CardanoService(
                accessToken
            ).getEndorsementChain({
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
            next(handleServerError(error));
        }
    },
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
                    : await AuthenticationService().authenticationProgress();
            const credentialContentResponse = await ControllerService(
                accessToken
            ).getCredentialContent({
                did,
            });
            const credentialContent = credentialContentResponse?.data;
            delete credentialContent._id;
            delete credentialContent.createdAt;
            delete credentialContent.updatedAt;
            return res.status(200).json({
                valid: true,
                data: credentialContent,
            });
        } catch (error) {
            next(handleServerError(error));
        }
    },
};
