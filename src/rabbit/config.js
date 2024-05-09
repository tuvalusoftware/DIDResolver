export const RABBITMQ_SERVICE = {
    cardano: {
        CardanoErrorService: "CardanoCardanoErrorService",
        CardanoDocumentService: "CardanoDocumentService",
    },
    stellar: {
        StellarService: "StellarService",
    },
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
