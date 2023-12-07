import dotenv from "dotenv";
import { splitDid } from "../utils/index.js";
import { handleServiceError } from "../configs/errors/errorHandler.js";
import { env } from "../configs/constants.js";
import axios from "axios";

dotenv.config();

const ControllerService = () => {
    const controllerUrl = env.DID_CONTROLLER;
    const corsConfig = {
        headers: {},
    };

    return {
        async storeCredentials({ payload }) {
            return new Promise((resolve, reject) => {
                axios
                    .post(
                        controllerUrl + "/api/v2/credential",
                        payload,
                        corsConfig
                    )
                    .then((response) => {
                        handleServiceError(response);
                        resolve(response);
                    })
                    .catch((error) => reject(error));
            });
        },

        async isExisted({ companyName, fileName }) {
            return new Promise((resolve, reject) => {
                axios
                    .get(controllerUrl + "/api/v2/doc/exists", {
                        ...corsConfig,
                        params: {
                            companyName,
                            fileName,
                        },
                    })
                    .then((response) => {
                        handleServiceError(response);
                        resolve(response);
                    })
                    .catch((error) => reject(error));
            });
        },

        async storeDocument({ companyName, fileName, wrappedDocument }) {
            return new Promise((resolve, reject) => {
                axios
                    .post(
                        controllerUrl + "/api/v2/doc",
                        {
                            companyName,
                            fileName,
                            wrappedDocument,
                        },
                        corsConfig
                    )
                    .then((response) => {
                        handleServiceError(response);
                        resolve(response);
                    })
                    .catch((error) => reject(error));
            });
        },

        async getDocumentContent({ did }) {
            return new Promise((resolve, reject) => {
                const { fileName, companyName } = splitDid(did);
                axios
                    .get(controllerUrl + "/api/v2/doc", {
                        ...corsConfig,
                        params: {
                            companyName,
                            fileName,
                            only: "doc",
                        },
                    })
                    .then((response) => {
                        handleServiceError(response);
                        resolve(response);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        },

        async getDocumentDid({ did }) {
            return new Promise((resolve, reject) => {
                const { fileName, companyName } = splitDid(did);
                axios
                    .get(controllerUrl + "/api/v2/doc", {
                        ...corsConfig,
                        params: {
                            companyName,
                            fileName,
                            only: "did",
                        },
                    })
                    .then((response) => {
                        handleServiceError(response);
                        resolve(response);
                    })
                    .catch((error) => reject(error));
            });
        },

        async getCredentialContent({ did }) {
            return new Promise((resolve, reject) => {
                axios
                    .get(
                        controllerUrl + `/api/v2/credential/${did}`,
                        corsConfig
                    )
                    .then((response) => {
                        handleServiceError(response);
                        resolve(response);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        },

        async updateDocumentDid({ did, didDoc }) {
            const { fileName, companyName } = splitDid(did);
            return new Promise((resolve, reject) => {
                axios
                    .put(
                        controllerUrl + "/api/v2/doc",
                        {
                            companyName,
                            fileName,
                            didDoc: didDoc,
                        },
                        corsConfig
                    )
                    .then((response) => {
                        handleServiceError(response);
                        resolve(response);
                    })
                    .catch((error) => reject(error));
            });
        },
    };
};

export default ControllerService;
