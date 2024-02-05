import { asyncWrapper } from "../../middlewares/async.js";
import schemaValidator from "../../../helpers/validator.js";
import requestSchema from "../../../configs/schemas/request.schema.js";
import ControllerService from "../../../services/Controller.service.js";
import dotenv from "dotenv";
import Logger from "../../../libs/logger.js";
import { createRequire } from "module";
import { fileURLToPath } from "node:url";

dotenv.config();
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const logger = Logger(__filename);

export default {
    getTransactionIdByDid: asyncWrapper(async (req, res, next) => {
        logger.apiInfo(req, "Get transaction id by did v1");
        const payload = schemaValidator(
            requestSchema.getTransactionId,
            req.body
        );
        const { did } = payload;
        const [documentResponse, credentialResponse] = await Promise.allSettled(
            [
                ControllerService().getDocumentContent({
                    did: did,
                }),
                ControllerService().getCredentialContent({
                    did: did,
                }),
            ]
        );
        if (
            documentResponse.status === "fulfilled" &&
            documentResponse.value.data?.wrappedDoc?.mintingConfig?.txHash &&
            documentResponse.value.data?.wrappedDoc?.mintingConfig?.assetName
        ) {
            return res.status(200).json({
                transactionId:
                    documentResponse.value.data.wrappedDoc.mintingConfig.txHash,
                hashOfDocument:
                    documentResponse.value.data.wrappedDoc.mintingConfig
                        .assetName,
            });
        }
        if (
            credentialResponse.status === "fulfilled" &&
            credentialResponse?.value?.data?.txHash
        ) {
            return res.status(200).json({
                transactionId: credentialResponse.value.data.txHash,
            });
        }
        return res.status(200).json({
            transactionId: null,
            hashOfDocument: null,
        });
    }),
};
