import { REQUEST_TYPE } from "../config/constants.js";
import { ERRORS } from "../config/errors/error.constants.js";
import QUEUE_SCHEMA from "../config/schemas/taskQueue.js";
import { validateJSONSchema } from "../api/utils/index.js";
import { SERVERS } from "../config/constants.js";
import axios from "axios";

export const TaskQueueHelper = {
  sendMintingRequest: async ({ data, type, did }) => {
    try {
      let requestType, verifierSchema;
      switch (type) {
        case REQUEST_TYPE.MINT: {
          requestType = REQUEST_TYPE.MINT;
          verifierSchema = QUEUE_SCHEMA.MINT_DATA;
          break;
        }
        case REQUEST_TYPE.BURN: {
          requestType = REQUEST_TYPE.BURN;
          verifierSchema = QUEUE_SCHEMA.BURN_DATA;
          break;
        }
        case REQUEST_TYPE.UPDATE:
          requestType = REQUEST_TYPE.UPDATE;
          verifierSchema = QUEUE_SCHEMA.UPDATE_DATA;
          break;
        default:
          throw new Error("Invalid minting type.");
      }
      const validateData = validateJSONSchema(verifierSchema, data);
      if (!validateData.valid) {
        throw ERRORS.INVALID_INPUT;
      }
      const requestResponse = await axios.post(
        SERVERS.TASK_QUEUE_SERVICE + "/api/mint",
        {
          request: {
            data,
            type: requestType,
            did: did,
          },
        }
      );
      if (requestResponse?.data?.error_code) {
        throw requestResponse.data || ERRORS.PUSH_TO_TASK_QUEUE_FAILED;
      }
      return requestResponse;
    } catch (error) {
      throw error;
    }
  },
};
