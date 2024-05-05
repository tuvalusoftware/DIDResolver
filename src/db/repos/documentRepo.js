import { generateDid } from "../../fuixlabs-documentor/utils/did.js";
import consumerService from "../../services/Consumer.service.js";
import ControllerService from "../../services/Controller.service.js";
import { documentService } from "../../services/Document.service.js";
import RequestRepo from "./requestRepo.js";

const DocumentRepository = {
    _error: {},

    // ** CREATE ** \\
    /**
     * Creates a document and saves it into the database for tracking.
     * Sends a request to Cardano service to create the document in the Cardano blockchain.
     * Returns the transaction hash (txHash) and asset name (assetName) of the created document.
     *
     * @param {Object} wrappedDoc - The wrapped document object.
     * @param {string} fileName - The name of the document file.
     * @param {string} type - The type of the document.
     * @param {string} companyName - The name of the company.
     * @returns {Object} An object containing the transaction hash (txHash) and asset name (assetName) of the created document.
     * @throws {Error} If an error occurs during the process.
     */
    async createDocument(wrappedDoc, fileName, type, companyName) {
        try {
            const did = generateDid(companyName, fileName);
            const isExists = await this.isExists(companyName, fileName);
            if (isExists) {
            }

            // Generate data for issuing document by
            const dataForm = await documentService.createWrappedDocumentData(
                fileName,
                wrappedDoc,
                type
            );

            // Add signature to document what created by signing admin
            const { wrappedDocument } =
                await documentService.issueBySignByAdmin(dataForm, companyName);

            // Save creating document into database for tracking
            const request = await RequestRepo.createRequest({
                data: {
                    wrappedDocument,
                },
                type: "createDocument",
                status: "pending",
            });

            // Send request to Cardano service to create document through RabbitMQ
            /**
             * Current now we are using test data for creating document
             * We will use RabbitMQ to send request to Cardano service
             * to create document in Cardano blockchain
             * We will receive txHash and assetName from Cardano service
             * and save them into database
             * txHash: hash of nft in Cardano blockchain
             * assetName: hash of document
             * Will mock data from RabbitMQ response $ASAP
             */

            const config = await consumerService.createDocument(
                wrappedDocument?.signature?.targetHash,
                request._id,
                "document",
                request
            );

            // Get txHash - hash of nft in Cardano blockchain, assetName - hash of document
            const { txHash, assetName } = config;
            return { txHash, assetName, did };
        } catch (error) {
            throw error;
        }
    },

    /**
     * Stores a document in the database.
     *
     * @param {Object} data - The data of the document.
     * @param {Object} mintingConfig - The minting configuration of the document.
     * @param {Object} options - Additional options.
     * @param {string} options.companyName - The name of the company associated with the document.
     * @param {string} options.fileName - The name of the file associated with the document.
     * @returns {Promise<void>} A promise that resolves when the document is stored successfully.
     */
    async storeDocument(
        document,
        {
            companyName,
            fileName,            
        }
    ) {
        await ControllerService().storeDocument({
            companyName,
            fileName,
            wrappedDocument: document,
        });
    },

    // ** HELPER FUNCTIONS ** \\
    /**
     * Checks if a document exists for a given company and file name.
     *
     * @param {string} companyName - The name of the company.
     * @param {string} fileName - The name of the file.
     * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating whether the document exists or not.
     */
    async isExists(companyName, fileName) {
        const isExists = await ControllerService().isExisted({
            companyName,
            fileName,
        });
        return isExists;
    },
};

export default DocumentRepository;
