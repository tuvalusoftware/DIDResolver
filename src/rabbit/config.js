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
        createDocument: "create-document",
    },
};
