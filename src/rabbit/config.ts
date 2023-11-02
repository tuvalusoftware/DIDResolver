import "dotenv/config";

export const RABBITMQ_SERVICE = {
    CardanoService: process.env.CardanoService || "CardanoService",
    ResolverService: process.env.ResolverService || "ResolverService",
    ErrorService: process.env.ErrorService || "ErrorService",
};

export const REQUEST_TYPE = {
    CARDANO_SERVICE: {
        mintToken: "mint-token",
        mintCredential: "mint-credential",
        updateToken: "update-token",
        burnToken: "burn-token",
    },
    MINTING_TYPE: {
        createContract: "create-contract",
        createPlot: "create-plot",
        createClaimantCredential: "create-claimant-credential",
        updatePlot: "update-plot",
        deletePlot: "delete-plot",
    },
};
