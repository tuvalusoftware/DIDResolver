import dotenv from "dotenv";
import { ERRORS } from "../../../configs/errors/error.constants.js";
import ControllerService from "../../../services/Controller.service.js";
import CardanoService from "../../../services/Cardano.service.js";
import schemaValidator from "../../../helpers/validator.js";
import requestSchema from "../../../configs/schemas/request.schema.js";
import { asyncWrapper } from "../../middlewares/async.js";

dotenv.config();

export default {
    verifyCertificate: asyncWrapper(async (req, res, next) => {
        const { did } = schemaValidator(
            requestSchema.verifyCertificate,
            req.body
        );
        const documentContentResponse =
            await ControllerService().getDocumentContent({
                did,
            });
        const documentHash =
            documentContentResponse?.data?.wrappedDoc?.signature?.targetHash;
        const policyId =
            documentContentResponse?.data?.wrappedDoc?.mintingConfig?.policy
                ?.id;
        await CardanoService().verifyCardanoNft({
            hashofdocument: documentHash,
            policyid: policyId,
        });
        const getEndorsementChainResponse =
            await CardanoService().getEndorsementChain({
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
    }),
    verifyVerifiableCredential: asyncWrapper(async (req, res, next) => {
        const { did } = schemaValidator(
            requestSchema.verifyCertificate,
            req.body
        );
        const credentialContentResponse =
            await ControllerService().getCredentialContent({
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
    }),
};
