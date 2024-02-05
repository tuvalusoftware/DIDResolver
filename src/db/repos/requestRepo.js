import { AppError } from "../../configs/errors/appError.js";
import { RequestModel } from "../models/requestModel.js";
import { ERRORS } from "../../configs/errors/error.constants.js";

const RequestRepo = {
    createRequest: async (request) => {
        try {
            const _request = await RequestModel.create(request);
            _request.save();
            return _request;
        } catch (error) {
            throw error;
        }
    },
    findOneAndUpdate: async (request, filter) => {
        try {
            const updatedRequest = await RequestModel.findOneAndUpdate(
                filter,
                request
            );
            if (!updatedRequest) {
                throw new AppError(ERRORS.NOT_FOUND);
            }
            return updatedRequest;
        } catch (error) {
            throw error;
        }
    },
    findOne: async (filter) => {
        try {
            const request = await RequestModel.findOne(filter);
            return request;
        } catch (error) {
            throw error;
        }
    },
};

export default RequestRepo;
