import { unsalt } from "../../../fuixlabs-documentor/utils/data.js";
import { asyncWrapper } from "../../middlewares/async.js";
import schemaValidator from "../../../helpers/validator.js";
import requestSchema from "../../../configs/schemas/request.schema.js";
import dotenv from "dotenv";
import Logger from "../../../../logger.js";
import { createRequire } from "module";
import { fileURLToPath } from "node:url";

dotenv.config();
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const logger = Logger(__filename);

export default {
    unsaltData: asyncWrapper(async (req, res, next) => {
        logger.apiInfo(req, "Unsalt data");
        const { data } = schemaValidator(requestSchema.unsaltData, req.body);
        const unsaltedData = unsalt(data);
        return res.status(200).json({
            success: true,
            status_message: "Unsalted data successfully!",
            data: unsaltedData,
        });
    }),
};
