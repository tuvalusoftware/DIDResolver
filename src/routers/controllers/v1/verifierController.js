import "dotenv/config";
import { ERRORS } from "../../../configs/errors/error.constants.js";
import ControllerService from "../../../services/Controller.service.js";
import AuthenticationService from "../../../services/Authentication.service.js";
import CardanoService from "../../../services/Cardano.service.js";
import schemaValidator from "../../../helpers/validator.js";
import requestSchema from "../../../configs/schemas/request.schema.js";
import { asyncWrapper } from "../../middlewares/async.js";

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
    verifyCertificate: asyncWrapper(async (req, res, next) => {
        const { did } = schemaValidator(
            requestSchema.verifyCertificate,
            req.body
        );
        const accessToken =
            env.NODE_ENV === "test"
                ? "mock-access-token"
                : await AuthenticationService().authenticationProgress();
        const documentContentResponse = await ControllerService(
            accessToken
        ).getDocumentContent({
            did,
        });
        const documentHash =
            documentContentResponse?.data?.wrappedDoc?.signature?.targetHash;
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
    }),
    verifyVerifiableCredential: asyncWrapper(async (req, res, next) => {
        const { did } = schemaValidator(
            requestSchema.verifyCertificate,
            req.body
        );
        const accessToken =
            env.NODE_ENV === "test"
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
    }),
};
