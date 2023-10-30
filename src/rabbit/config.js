import "dotenv/config";

export const RABBITMQ_SERVICE = {
    CardanoService: process.env.CardanoService || "CardanoService",
    ResolverService: process.env.ResolverService || "ResolverService",
};

export const REQUEST_TYPE = {
    CARDANO_SERVICE: {
        mintToken: "mint-token",
    },
    MINTING_TYPE: {
        createContract: "create-contract",
        createPlot: "create-plot",
    },
};