import schemaValidator from "../helpers/validator.js";
import wrappedDocumentSchema from "../configs/schemas/wrappedDocument.schema.js";
import { getAccountBySeedPhrase } from "../utils/lucid.js";
import { createDocumentTaskQueue } from "../utils/document.js";
import { getPublicKeyFromAddress, getCurrentDateTime } from "../utils/index.js";
import ControllerService from "./Controller.service.js";
import { generateDid } from "../fuixlabs-documentor/utils/did.js";

// * Constants
import { env, WRAPPED_DOCUMENT_TYPE } from "../configs/constants.js";

const adminSeedPhrase = env.ADMIN_SEED_PHRASE;
const companyName = env.COMPANY_NAME;

const { currentWallet, lucidClient } = await getAccountBySeedPhrase({
    seedPhrase: env.ADMIN_SEED_PHRASE,
});

const DocumentService = (accessToken) => {
    return {
        async issueBySignByAdmin(issueData, companyName) {
            try {
                schemaValidator(
                    wrappedDocumentSchema.dataForIssueDocument,
                    issueData
                );
                const { currentWallet, lucidClient } =
                    await getAccountBySeedPhrase({
                        seedPhrase: env.ADMIN_SEED_PHRASE,
                    });
                const { wrappedDocument } = await createDocumentTaskQueue({
                    seedPhrase: env.ADMIN_SEED_PHRASE,
                    documents: [issueData],
                    address: getPublicKeyFromAddress(
                        currentWallet?.paymentAddr
                    ),
                    access_token: accessToken,
                    client: lucidClient,
                    currentWallet: currentWallet,
                    companyName: companyName,
                });
                return {
                    wrappedDocument,
                };
            } catch (error) {
                throw error;
            }
        },
        async createWrappedDocumentData(data, type) {
            try {
                switch (type) {
                    case WRAPPED_DOCUMENT_TYPE.LOAN_CONTRACT: {
                        console.log("data", data);
                        const fileName = `LoanContract_${data._id || data.id}`;
                        const isExistedResponse = await ControllerService(
                            accessToken
                        ).isExisted({
                            companyName,
                            fileName,
                        });
                        const did = generateDid(companyName, fileName);
                        if (isExistedResponse?.data?.isExisted) {
                            const getDocumentResponse = await ControllerService(
                                accessToken
                            ).getDocumentContent({
                                did: contractDid,
                            });
                            const document =
                                getDocumentResponse?.data?.wrappedDoc;
                            return {
                                isExisted: true,
                                wrappedDocument: document,
                            };
                        }
                        const dataForm = {
                            fileName,
                            name: WRAPPED_DOCUMENT_TYPE.LOAN_CONTRACT,
                            title: `${WRAPPED_DOCUMENT_TYPE.LOAN_CONTRACT}-${data?._id}`,
                            dateIssue: getCurrentDateTime(),
                        };
                        return {
                            dataForm,
                            companyName,
                            did,
                            fileName,
                        };
                    }
                    case WRAPPED_DOCUMENT_TYPE.PLOT_CERTIFICATE: {
                    }
                    default:
                        throw new Error("Invalid type");
                }
            } catch (error) {
                throw error;
            }
        },
    };
};

export default DocumentService;
