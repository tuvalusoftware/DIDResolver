import { unsalt } from "../../../fuixlabs-documentor/utils/data.js";
import schemaValidator from "../../../helpers/validator.js";
import requestSchema from "../../../configs/schemas/request.schema.js";

export default {
    unsaltData: async (req, res, next) => {
        try {
            const { data } = schemaValidator(
                requestSchema.unsaltData,
                req.body
            );
            const unsaltedData = unsalt(data);
            return res.status(200).json({
                success: true,
                status_message: "Unsalted data successfully!",
                data: unsaltedData,
            });
        } catch (error) {
            next(error);
        }
    },
};
