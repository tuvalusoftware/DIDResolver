// * Utilities
import axios from "axios";
import "dotenv/config";
import {
    checkUndefinedVar,
    getCurrentDateTime,
    getPublicKeyFromAddress,
    validateJSONSchema,
    validateDID,
} from "../../utils/index.js";
import { createDocumentTaskQueue } from "../../utils/document.js";
import {
    AuthHelper,
    ControllerHelper,
    CardanoHelper,
} from "../../helpers/index.js";
import { getAccountBySeedPhrase } from "../../utils/lucid.js";
import logger from "../../../logger.js";

// * Constants
import { ERRORS } from "../../config/errors/error.constants.js";
import { generateDid } from "../../fuixlabs-documentor/utils/did.js";
import contractSchema from "../../config/schemas/contract.schema.js";

axios.defaults.withCredentials = true;

export default {
    /**
     * Creates a new contract
     * @memberof contractController
     * @async
     * @function createContract
     * @param {Object} req - The request object
     * @param {Object} res - The response object
     * @param {Function} next - The next middleware function
     * @returns {Object} - The response object containing the DID of the created contract
     */
    createContract: async (req, res, next) => {
        try {
            logger.apiInfo(req, res, "Request API: Create Contract!");
            const { contract } = req.body;
            const undefinedVar = checkUndefinedVar({
                contract,
            });
            if (undefinedVar.undefined) {
                return next({
                    ...ERRORS.MISSING_PARAMETERS,
                    detail: undefinedVar.detail,
                });
            }
            const validateSchema = validateJSONSchema(
                contractSchema.CREATE_CONTRACT_REQUEST_BODY,
                contract
            );
            if (!validateSchema.valid) {
                return next(ERRORS.INVALID_INPUT);
            }
            const contractFileName = `LoanContract_${
                contract._id || contract.id
            }`;
            const companyName = process.env.COMPANY_NAME;
            logger.apiInfo(req, res, `Pdf file name: ${contractFileName}`);
            const accessToken =
                process.env.NODE_ENV === "test"
                    ? "mock-access-token"
                    : await AuthHelper.authenticationProgress();
            const isExistedResponse = await ControllerHelper.isExisted({
                accessToken: accessToken,
                companyName: companyName,
                fileName: contractFileName,
            });
            const contractDid = generateDid(companyName, contractFileName);
            if (isExistedResponse?.data?.isExisted) {
                logger.apiInfo(
                    req,
                    res,
                    `Document ${contractFileName} existed`
                );
                const getDocumentResponse =
                    await ControllerHelper.getDocumentContent({
                        accessToken,
                        did: contractDid,
                    });
                const wrappedDocument = getDocumentResponse?.data?.wrappedDoc;
                return res.status(200).json(wrappedDocument);
            }
            const contractForm = {
                fileName: contractFileName,
                name: `Loan Contract`,
                title: `Land-Certificate-${contract?._id}`,
                dateIssue: getCurrentDateTime(),
            };
            const { currentWallet, lucidClient } = await getAccountBySeedPhrase(
                {
                    seedPhrase: process.env.ADMIN_SEED_PHRASE,
                }
            );
            const { wrappedDocument } = await createDocumentTaskQueue({
                seedPhrase: process.env.ADMIN_SEED_PHRASE,
                documents: [contractForm],
                address: getPublicKeyFromAddress(currentWallet?.paymentAddr),
                access_token: accessToken,
                client: lucidClient,
                currentWallet: currentWallet,
                companyName: companyName,
            });
            const mintingResponse = await CardanoHelper.storeToken({
                hash: wrappedDocument?.signature?.targetHash,
                accessToken,
            });
            const mintingConfig = mintingResponse?.data?.data;
            const willWrappedDocument = {
                ...wrappedDocument,
                mintingConfig,
            };
            const storeWrappedDocumentResponse =
                await ControllerHelper.storeDocument({
                    accessToken,
                    companyName,
                    fileName: contractFileName,
                    wrappedDocument: willWrappedDocument,
                });
            return res.status(200).json({
                did: contractDid,
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
     * Retrieves a contract by its DID
     * @memberof contractController
     * @async
     * @function getContract
     * @param {Object} req - The request object
     * @param {Object} res - The response object
     * @param {Function} next - The next middleware function
     * @returns {Object} - The response object containing the hash and DID of the retrieved contract
     */
    getContract: async (req, res, next) => {
        try {
            logger.apiInfo(req, res, "Request API: Get Contract!");
            const { did } = req.params;
            const { valid } = validateDID(did);
            if (!valid) {
                return next(ERRORS.INVALID_DID);
            }
            const accessToken =
                process.env.NODE_ENV === "test"
                    ? "mock-access-token"
                    : await AuthHelper.authenticationProgress();
            const docContentResponse =
                await ControllerHelper.getDocumentContent({
                    did: did,
                    accessToken: accessToken,
                });
            const hash =
                docContentResponse?.data?.wrappedDoc?.signature?.targetHash;
            return res.status(200).json({
                hash: hash,
                did: did,
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
