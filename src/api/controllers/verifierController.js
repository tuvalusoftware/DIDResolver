import axios from "axios";
import "dotenv/config";
import logger from "../../../logger.js";
import { validateJSONSchema } from "../utils/index.js";
import {
    checkUndefinedVar,
    getCurrentDateTime,
    getPublicKeyFromAddress,
    generateRandomString,
    validateDID,
} from "../utils/index.js";
import {
    AuthHelper,
    CardanoHelper,
    ControllerHelper,
    TaskQueueHelper,
    VerifiableCredentialHelper,
} from "../../helpers/index.js";
import { ERRORS } from "../../config/errors/error.constants.js";

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
                    : await AuthHelper.authenticationProgress();
            const documentContentResponse =
                await ControllerHelper.getDocumentContent({
                    did,
                    accessToken,
                });

            console.log({
                hashofdocument:
                    documentContentResponse?.data?.wrappedDoc?.signature
                        ?.targetHash,
                accessToken,
                policyid:
                    documentContentResponse?.data?.wrappedDoc?.mintingConfig
                        ?.policy?.id,
            });
            await CardanoHelper.verifyCardanoNft({
                hashofdocument:
                    documentContentResponse?.data?.wrappedDoc?.signature
                        ?.targetHash,
                accessToken,
                policyid:
                    documentContentResponse?.data?.wrappedDoc?.mintingConfig
                        ?.policy?.id,
            });
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
            console.log(1, did);
            const credentialContentResponse =
                await ControllerHelper.getCredentialContent({
                    accessToken,
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
