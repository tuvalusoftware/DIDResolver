export const RABBITMQ_SERVICE = {
    CardanoService: "CardanoService",
    ResolverService: "ResolverService",
    ErrorService: "CardanoErrorService",
    CardanoContractService: "CardanoContractService",
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
        createPlot2: "create-plot-2",
        createClaimantCredential: "create-claimant-credential",
        updatePlot: "update-plot",
        updatePlot2: "update-plot-2",
        deletePlot: "delete-plot",
        addClaimantToPlot: "add-claimant-to-plot",
        addClaimantToPlot2: "add-claimant-to-plot-2",
        signContract: "sign-contract",
        createContractHistory: "createContractHistory",
    },
};
