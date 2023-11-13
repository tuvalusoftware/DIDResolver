import axios from "axios";
import "dotenv/config";
import RequestRepo from "../../../db/repos/requestRepo.js";
import { REQUEST_TYPE } from "../../../rabbit/config.js";
import schemaValidator from "../../../helpers/validator.js";
import requestSchema from "../../../configs/schemas/request.schema.js";
import AuthenticationService from "../../../services/Authentication.service.js";
import CardanoService from "../../../services/Cardano.service.js";
import DocumentService from "../../../services/Document.service.js";

// * Constants
import { env, WRAPPED_DOCUMENT_TYPE } from "../../../configs/constants.js";
import wrappedDocumentSchema from "../../../configs/schemas/wrappedDocument.schema.js";

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
            const { wrappedDoc, metadata } = schemaValidator(
                requestSchema.createContract,
                req.body
            );
            const accessToken =
                env.NODE_ENV === "test"
                    ? "mock-access-token"
                    : await AuthenticationService().authenticationProgress();
            const companyName = env.COMPANY_NAME;
            const response = await DocumentService(
                accessToken
            ).createWrappedDocumentData(
                wrappedDoc,
                WRAPPED_DOCUMENT_TYPE.LOAN_CONTRACT,
                companyName
            );
            if (response?.isExisted) {
                return res.status(200).json(response.wrappedDocument);
            }
            const { dataForm, did } = response;
            schemaValidator(
                wrappedDocumentSchema.dataForIssueDocument,
                dataForm
            )
            const { wrappedDocument } = await DocumentService(
                accessToken
            ).issueBySignByAdmin(dataForm, companyName);
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
            return res.status(200).json({
                did,
            });
        } catch (error) {
            next(error);
        }
    },
};
