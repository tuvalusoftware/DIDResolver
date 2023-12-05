import { asyncWrapper } from "../../middlewares/async.js";
import schemaValidator from "../../../helpers/validator.js";
import requestSchema from "../../../configs/schemas/request.schema.js";
import ControllerService from "../../../services/Controller.service.js";

export default {
    getTransactionIdByDid: asyncWrapper(async (req, res, next) => {
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
            documentResponse.value.data?.wrappedDoc?.mintingConfig?.txHash
        ) {
            return res.status(200).json({
                transactionId:
                    documentResponse.value.data.wrappedDoc.mintingConfig.txHash,
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
        });
    }),
};
