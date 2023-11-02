interface MintingConfig {
    unit: string;
    forgingScript: string;
    policyId: string;
    assetName: string;
    txHash: string;
}

export interface ContractCreationPayload {
    companyName: string;
    fileName: string;
    mintingConfig?: MintingConfig;
    claimants?: Object[];
    plot?: Object;
    did: string;
    wrappedDocument: Object;
    metadata?: Object | null;
}

export interface PlotCreationPayload {
    companyName: string;
    fileName: string;
    did: string;
    wrappedDocument: Object;
    mintingConfig: MintingConfig;
    claimants: Object[];
    plot: Object;
}

export interface ProducerPayload {
    type: string;
    data: string;
    id: string;
    options?: Object;
}
