import { errorHandlerMiddleware } from "../../routers/middlewares/errorHandler.js";

export const setUpErrorHandler = (app) => {
    app.use(errorHandlerMiddleware);
};
