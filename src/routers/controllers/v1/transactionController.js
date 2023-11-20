import { asyncWrapper } from "../../middlewares/async.js";
import schemaValidator from "../../../helpers/validator.js";
import requestSchema from "../../../configs/schemas/request.schema.js";
import ControllerService from "../../../services/Controller.service.js";
import AuthenticationService from "../../../services/Authentication.service.js";
import { splitDid } from "../../../utils/index.js";

export default {
    getTransactionIdByDid: asyncWrapper(async (req, res, next) => {
        const payload = schemaValidator(
            requestSchema.getTransactionId,
            req.body
        );
        const { did } = payload;
        const { companyName, fileName } = splitDid(did);
        const accessToken =
            await AuthenticationService().authenticationProgress();
        const response = await ControllerService(accessToken).isExisted({
            companyName,
            fileName,
        });
        if (!response.data.isExisted) {
            return res.status(200).json({
                transactionId: null,
            });
        }
        const _response = await ControllerService(
            accessToken
        ).getDocumentContent({ did: did });
        const { txHash } = _response.data?.wrappedDoc?.mintingConfig;
        return res.status(200).json({
            transactionId: txHash,
        });
    }),
};
