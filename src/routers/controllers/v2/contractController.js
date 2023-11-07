// * Utilities
import axios from "axios";
import "dotenv/config";
import {
    checkUndefinedVar,
    getCurrentDateTime,
    getPublicKeyFromAddress,
    validateJSONSchema,
} from "../../../utils/index.js";
import { createDocumentTaskQueue } from "../../../utils/document.js";
import { getAccountBySeedPhrase } from "../../../utils/lucid.js";
import logger from "../../../../logger.js";
import RequestRepo from "../../../db/repos/requestRepo.js";
import { REQUEST_TYPE } from "../../../rabbit/config.js";
import { handleServerError } from "../../../configs/errors/errorHandler.js";
import ControllerService from "../../../services/Controller.service.js";

// * Constants
import { ERRORS } from "../../../configs/errors/error.constants.js";
import { generateDid } from "../../../fuixlabs-documentor/utils/did.js";
import contractSchema from "../../../configs/schemas/contract.schema.js";
import AuthenticationService from "../../../services/Authentication.service.js";
import CardanoService from "../../../services/Cardano.service.js";
import { env } from "../../../configs/constants.js";

axios.defaults.withCredentials = true;

/**
 * Controller for creating and getting contracts.
 * @typedef {Object} ContractController
 * @property {Function} createContract - Creates a new contract.
 * @property {Function} getContract - Gets an existing contract by DID.
 */
export default {
    createContract: async (req, res, next) => {
        try {
            logger.apiInfo(req, res, "Request API: Create Contract!");
            const { wrappedDoc, metadata } = req.body;
            const undefinedVar = checkUndefinedVar({
                wrappedDoc,
            });
            if (undefinedVar.undefined) {
                return next({
                    ...ERRORS.MISSING_PARAMETERS,
                    detail: undefinedVar.detail,
                });
            }
            const validateSchema = validateJSONSchema(
                contractSchema.CREATE_CONTRACT_REQUEST_BODY,
                wrappedDoc
            );
            if (!validateSchema.valid) {
                return next(ERRORS.INVALID_INPUT);
            }
            const contractFileName = `LoanContract_${
                wrappedDoc._id || wrappedDoc.id
            }`;
            const companyName = env.COMPANY_NAME;
            logger.apiInfo(req, res, `Pdf file name: ${contractFileName}`);
            const accessToken =
                env.NODE_ENV === "test"
                    ? "mock-access-token"
                    : await AuthenticationService().authenticationProgress();
            const isExistedResponse = await ControllerService(
                accessToken
            ).isExisted({
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
                const getDocumentResponse = await ControllerService(
                    accessToken
                ).getDocumentContent({
                    did: contractDid,
                });
                const wrappedDocument = getDocumentResponse?.data?.wrappedDoc;
                return res.status(200).json(wrappedDocument);
            }
            const contractForm = {
                fileName: contractFileName,
                name: `Loan Contract`,
                title: `Land-Certificate-${wrappedDoc?._id}`,
                status: wrappedDoc?.status,
                dateIssue: getCurrentDateTime(),
            };
            const { currentWallet, lucidClient } = await getAccountBySeedPhrase(
                {
                    seedPhrase: env.ADMIN_SEED_PHRASE,
                }
            );
            const { wrappedDocument } = await createDocumentTaskQueue({
                seedPhrase: env.ADMIN_SEED_PHRASE,
                documents: [contractForm],
                address: getPublicKeyFromAddress(currentWallet?.paymentAddr),
                access_token: accessToken,
                client: lucidClient,
                currentWallet: currentWallet,
                companyName: companyName,
            });
            const request = await RequestRepo.createRequest({
                data: {
                    wrappedDocument,
                    metadata,
                },
                type: REQUEST_TYPE.MINTING_TYPE.createContract,
                status: "pending",
            });
            await CardanoService(accessToken).storeToken({
                hash: wrappedDocument?.signature?.targetHash,
                id: request._id,
                type: "document",
            });
            logger.apiInfo(req, res, `Document ${contractFileName} created!`);
            return res.status(200).json({
                did: contractDid,
            });
        } catch (error) {
            next(handleServerError(error));
        }
    },
};
