import { handleServiceError } from "../configs/errors/errorHandler.js";
import {
    CardanoProducer,
    CardanoContractProducer,
} from "../rabbit/rabbit.producer.js";
import { REQUEST_TYPE } from "../rabbit/config.js";
import "dotenv/config";
import axios from "axios";

const CardanoService = (accessToken) => {
    const corsConfig = {
        withCredentials: true,
        headers: {},
    };

    return {
        async burnToken({ mintingConfig, skipWait = false, id }) {
            return await CardanoProducer({
                data: {
                    ...mintingConfig,
                },
                options: {
                    skipWait,
                },
                type: REQUEST_TYPE.CARDANO_SERVICE.burnToken,
                id,
            });
        },

        async verifyCardanoNft({ hashOfDocument, policyId }) {
            let query = { policyId };
            if (hashOfDocument) {
                query = { asset: `${policyId}${hashOfDocument}` };
            }
            return new Promise((resolve, reject) => {
                axios
                    .post("serverUrl" + "/api/v2/fetch/nft", query, corsConfig)
                    .then((response) => {
                        handleServiceError(response);
                        resolve(response.data);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        },

        async storeToken({
            hash,
            id,
            type = "document",
            skipWait = true,
            isContract = false,
        }) {
            if (isContract) {
                return await CardanoContractProducer({
                    data: {
                        hash,
                        type,
                    },
                    options: {
                        skipWait,
                    },
                    type: REQUEST_TYPE.CARDANO_SERVICE.mintToken,
                    id,
                });
            } else {
                return await CardanoProducer({
                    data: {
                        hash,
                        type,
                    },
                    options: {
                        skipWait,
                    },
                    type: REQUEST_TYPE.CARDANO_SERVICE.mintToken,
                    id,
                });
            }
        },

        async storeCredentialsWithPolicyId({
            credentials,
            mintingConfig,
            id,
            skipWait = true,
        }) {
            return await CardanoProducer({
                data: {
                    config: mintingConfig,
                    credentials: credentials,
                    type: "credential",
                },
                options: {
                    skipWait,
                },
                type: REQUEST_TYPE.CARDANO_SERVICE.mintCredential,
                id,
            });
        },

        async updateToken({
            hash,
            mintingConfig,
            id,
            skipWait = true,
            type = "document",
        }) {
            return await CardanoProducer({
                data: {
                    newHash: hash,
                    config: {
                        ...mintingConfig,
                        burn: false,
                    },
                    type,
                },
                options: {
                    skipWait,
                },
                type: REQUEST_TYPE.CARDANO_SERVICE.updateToken,
                id,
            });
        },
    };
};

export default CardanoService;
