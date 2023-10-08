export const VALID_CREATE_PLOT_CERTIFICATE_REQUEST_WITHOUT_CLAIMANTS = {
    wrappedDocument: {
        data: {
            profileImage:
                "3d44bd43-9b4b-45a6-b4dc-25cdd738ff1a:string:sampleProfileImage",
            fileName: "Sample-Plot-Certificate-64db86559e77a4ffc2395ada_810_1",
            name: "328ecc0a-7a53-4a14-ab9b-c81fd9b25e21:string:Land Certificate",
            title: "2e9569eb-966b-4354-96e1-72ff516a126a:string:Land-Certificate-VNZ-739",
            No: "f910f941-e772-4a06-80a2-ebea28e1065c:string:ea2c033",
            dateIssue:
                "fc2523b9-dc48-4e70-995d-5761c3f70410:string:2023-10-08 04:29:46",
            plotInformation: ["Object"],
            certificateByCommonlands: ["Object"],
            certificateByCEO: ["Object"],
            companyName:
                "9a683014-fdc1-41a7-b645-d4f56755d9fd:string:COMMONLANDS_2",
            intention: "ffbc0ce2-e6f5-4bc4-8101-5a9b848bc516:string:trade",
            did: "e41d1aca-0f14-4799-9ecd-373798736b35:string:did:fuixlabs:COMMONLANDS_2:PlotCertification-64db86559e77a4ffc2395ada_810_1",
            issuers: [
                {
                    address: "0x1234567890abcdef",
                },
            ],
        },
        signature: {
            type: "SHA3MerkleProof",
            targetHash:
                "5561adf3a86ef445fc5b726c6c89521d67548a0b9a9956eb62349ad071476b20",
            proof: ["Array"],
            merkleRoot:
                "5561adf3a86ef445fc5b726c6c89521d67548a0b9a9956eb62349ad071476b20",
        },
        mintingConfig: {
            type: "document",
            policy: ["Object"],
            asset: "96f9eba3d9424b6c788166adfd93f36baa2f97ef282913ff40e871e25561adf3a86ef445fc5b726c6c89521d67548a0b9a9956eb62349ad071476b20",
            txHash: "b1d653de765f0c069683f71b15f1b622743cb8d10359998aeeabc5deec03512b",
            walletId: 2,
        },
    },
    plot: {
        plotId: "0x1234567890abcdef",
        plotSize: 1000,
        plotCoordinates: {
            latitude: 1.123456789,
            longitude: 2.123456789,
        },
        plotAddress: "0x1234567890abcdef",
        plotImage: "https://example.com/plot-image",
    },
    did: "did:cardano:1234567890abcdef",
    companyName: "Example Company",
};

export const VALID_CREATE_PLOT_CERTIFICATE_REQUEST = {
    wrappedDocument: {
        data: {
            profileImage:
                "3d44bd43-9b4b-45a6-b4dc-25cdd738ff1a:string:sampleProfileImage",
            fileName: "Sample-Plot-Certificate-64db86559e77a4ffc2395ada_810_1",
            name: "328ecc0a-7a53-4a14-ab9b-c81fd9b25e21:string:Land Certificate",
            title: "2e9569eb-966b-4354-96e1-72ff516a126a:string:Land-Certificate-VNZ-739",
            No: "f910f941-e772-4a06-80a2-ebea28e1065c:string:ea2c033",
            dateIssue:
                "fc2523b9-dc48-4e70-995d-5761c3f70410:string:2023-10-08 04:29:46",
            plotInformation: ["Object"],
            certificateByCommonlands: ["Object"],
            certificateByCEO: ["Object"],
            companyName:
                "9a683014-fdc1-41a7-b645-d4f56755d9fd:string:COMMONLANDS_2",
            intention: "ffbc0ce2-e6f5-4bc4-8101-5a9b848bc516:string:trade",
            did: "e41d1aca-0f14-4799-9ecd-373798736b35:string:did:fuixlabs:COMMONLANDS_2:PlotCertification-64db86559e77a4ffc2395ada_810_1",
            issuers: [
                {
                    address: "0x1234567890abcdef",
                },
            ],
        },
        signature: {
            type: "SHA3MerkleProof",
            targetHash:
                "5561adf3a86ef445fc5b726c6c89521d67548a0b9a9956eb62349ad071476b20",
            proof: ["Array"],
            merkleRoot:
                "5561adf3a86ef445fc5b726c6c89521d67548a0b9a9956eb62349ad071476b20",
        },
        mintingConfig: {
            type: "document",
            policy: ["Object"],
            asset: "96f9eba3d9424b6c788166adfd93f36baa2f97ef282913ff40e871e25561adf3a86ef445fc5b726c6c89521d67548a0b9a9956eb62349ad071476b20",
            txHash: "b1d653de765f0c069683f71b15f1b622743cb8d10359998aeeabc5deec03512b",
            walletId: 2,
        },
    },
    plot: {
        plotId: "0x1234567890abcdef",
        plotSize: 1000,
        plotCoordinates: {
            latitude: 1.123456789,
            longitude: 2.123456789,
        },
        plotAddress: "0x1234567890abcdef",
        plotImage: "https://example.com/plot-image",
        claimants: [
            {
                id: "did:fuixlabs:commonlands:12345678901",
                plot: "65191bba01a8fd1c431262a1",
                user: "65191bba01a8fd1c431262a2",
                type: "owner",
                plotCertificate: "did:fuixlabs:commonlands:09876",
            },
        ],
    },
    did: "did:cardano:1234567890abcdef",
    companyName: "Example Company",
};

export const TASK_QUEUE_CREDENTIAL_REQUEST = {
    VALID: {
        mintingConfig: {
            type: "document",
            policy: {
                type: "sampleType",
                script: "sampleScript",
                ttl: 23124354353,
                id: "sampleId",
            },
            asset: "sampleAsset",
            txHash: "sampleTxHash",
            walletId: 3,
        },
        credentialHash:
            "41dc24f184b647d4f204e81f4ec3f8034adbf42956bf30e17ad8f6f51e06159b",
        verifiedCredential: {
            "@context": [
                "https://www.w3.org/2018/credentials/v1",
                "https://cml-resolver.ap.ngrok.io/config/dominium-credential.json",
                "https://w3id.org/security/suites/ed25519-2020/v1",
            ],
            id: "did:fuixlabs:COMMONLANDS_2zum7awik",
            type: ["VerifiableCredential", "ClaimantCredential"],
            issuer: "did:fuixlabs:COMMONLANDS_2:PlotCertification-64db86559e77a4ffc2395ada_810_7",
            credentialSubject: {
                id: "did:fuixlabs:COMMONLANDS_2:41dc24f184b647d4f204e81f4ec3f8034adbf42956bf30e17ad8f6f51e06159b",
                type: [Array],
                claims: [Object],
            },
            proof: {
                type: "Ed25519Signature2020",
                created: "2023-10-08T07:51:38.172Z",
                verificationMethod:
                    "did:key:z6MkueyqD8Hbobmteu8QmxQm1H78gukUbHryrQ4xzyTchUBz#z6MkueyqD8Hbobmteu8QmxQm1H78gukUbHryrQ4xzyTchUBz",
                proofPurpose: "assertionMethod",
                proofValue:
                    "z5azZZDGX7ihMEYhCUxRYDxRGRTGsy8fZq5S5NMEtkLv84sw4r3Ya9esDaX72ttw3q7h8KC6ktefFwAU64cxa7tnG",
            },
        },
        companyName: "COMMONLANDS_2",
    },
};

export const CARDANO_ERROR_RESPONSE = {
    data: {
        code: 1,
        error_message: "Error from cardano service",
    },
};

export const CARDANO_RESPONSES = {
    CONFIG_RESPONSE: {
        code: 0,
        data: {
            policy: "1234567890abcdef",
            network: "testnet",
            protocol: "https",
            host: "cardano.example.com",
            port: 443,
        },
    },
    ERROR_RESPONSE: {
        code: 1,
        error_message: "Error from cardano service",
    },
};

export const CONTROLLER_RESPONSE = {
    ERROR: {
        error_code: 1,
        error_message: "Error from controller",
    },
    SUCCESS: {
        success: true,
        data: {},
    },
};

export const TASK_QUEUE_RESPONSE = {
    INVALID_INPUT: {
        error_code: 4002,
        error_message: "Bad request. Invalid input syntax.",
    },
    REQUEST_CREDENTIAL: {
        data: {
            did: "did:cardano:1234567890abcdef",
        },
    },
};

export const REVOKE_DOCUMENT_REQUEST = {
    mintingConfig: {
        type: "document",
        policy: ["Object"],
        asset: "sampleAsset",
        txHash: "sampleTxHash",
        walletId: 2,
    },
};
