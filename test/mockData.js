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
                "https://resolver-dev.ap.ngrok.io/config/dominium-credential.json",
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
    ENDORSEMENT_CHAIN_RESPONSE: {
        code: 0,
        data: [
            {
                asset: "bb5e38d3da281634c8eade0a289651840e14802a7c04bba894a582c6cb4032a26e998a43c9bcb1e7dbe3e570492b79348e0eb9eb724fadb3930fcfdf",
                policyId:
                    "bb5e38d3da281634c8eade0a289651840e14802a7c04bba894a582c6",
                assetName:
                    "280406fb598c8a325806bbb93e63ee6e815d958c5e118a5eea471a84addc3271",
                readableAssetName: "�@2�n��Cɼ�����pI+y4�\x0E��rO���\x0F��",
                fingerprint: "asset1dqmrfvjr7l98y7qu4p70ea0jkdfu9ulyjk4a78",
                quantity: 1,
                initialMintTxHash:
                    "030e9ccba3b428860aa67018450cae57d0107b0c2b977d78576f312bfde21ae0",
                mintOrBurnCount: 1,
                onchainMetadata: {
                    ttl: 3195103530,
                    name: "280406fb598c8a325806bbb93e63ee6e815d958c5e118a5eea471a84addc3271",
                    type: "document",
                    files: [Object],
                    image: "ipfs://QmPnRTjGG7h8YKmVa94gyC3Yc1Xz1hf1uq4QZwgpeTq9D2",
                    attach: "280406fb598c8a325806bbb93e63ee6e815d958c5e118a5eea471a84addc3271",
                    policy: "bb5e38d3da281634c8eade0a289651840e14802a7c04bba894a582c6",
                    version: 0,
                    mediaType: "image/png",
                    timestamp: 1697186730855,
                    description: "Fuixlab's wrap document",
                },
                originalOnchainMetadata: {
                    ttl: 3195103530,
                    name: "280406fb598c8a325806bbb93e63ee6e815d958c5e118a5eea471a84addc3271",
                    type: "document",
                    files: [Object],
                    image: "ipfs://QmPnRTjGG7h8YKmVa94gyC3Yc1Xz1hf1uq4QZwgpeTq9D2",
                    attach: "280406fb598c8a325806bbb93e63ee6e815d958c5e118a5eea471a84addc3271",
                    policy: "bb5e38d3da281634c8eade0a289651840e14802a7c04bba894a582c6",
                    version: 0,
                    mediaType: "image/png",
                    timestamp: 1697186730855,
                    description: "Fuixlab's wrap document",
                },
                metadata: {},
            },
            {
                asset: "bb5e38d3da281634c8eade0a289651840e14802a7c04bba894a582c6280406fb598c8a325806bbb93e63ee6e815d958c5e118a5eea471a84addc3271",
                policyId:
                    "bb5e38d3da281634c8eade0a289651840e14802a7c04bba894a582c6",
                assetName:
                    "280406fb598c8a325806bbb93e63ee6e815d958c5e118a5eea471a84addc3271",
                readableAssetName:
                    "(\x04\x06�Y��2X\x06��>c�n�]��^\x11�^�G\x1A���2q",
                fingerprint: "asset14rlv287jyvdvrf80rpnyhq96yqs25edqmglhx9",
                quantity: 1,
                initialMintTxHash:
                    "72195fcc7eb555bdd200f65978dd3bd8807d4412cf2c84618444f3d35f87eeb9",
                mintOrBurnCount: 1,
                onchainMetadata: {
                    ttl: 3195103530,
                    name: "280406fb598c8a325806bbb93e63ee6e815d958c5e118a5eea471a84addc3271",
                    type: "document",
                    files: [Object],
                    image: "ipfs://QmPnRTjGG7h8YKmVa94gyC3Yc1Xz1hf1uq4QZwgpeTq9D2",
                    attach: "280406fb598c8a325806bbb93e63ee6e815d958c5e118a5eea471a84addc3271",
                    policy: "bb5e38d3da281634c8eade0a289651840e14802a7c04bba894a582c6",
                    version: 1,
                    previous:
                        "cb4032a26e998a43c9bcb1e7dbe3e570492b79348e0eb9eb724fadb3930fcfdf",
                    mediaType: "image/png",
                    timestamp: 1697186941637,
                    description: "Fuixlab's Wrap Document",
                },
                originalOnchainMetadata: {
                    ttl: 3195103530,
                    name: "280406fb598c8a325806bbb93e63ee6e815d958c5e118a5eea471a84addc3271",
                    type: "document",
                    files: [Object],
                    image: "ipfs://QmPnRTjGG7h8YKmVa94gyC3Yc1Xz1hf1uq4QZwgpeTq9D2",
                    attach: "280406fb598c8a325806bbb93e63ee6e815d958c5e118a5eea471a84addc3271",
                    policy: "bb5e38d3da281634c8eade0a289651840e14802a7c04bba894a582c6",
                    version: 1,
                    previous:
                        "cb4032a26e998a43c9bcb1e7dbe3e570492b79348e0eb9eb724fadb3930fcfdf",
                    mediaType: "image/png",
                    timestamp: 1697186941637,
                    description: "Fuixlab's Wrap Document",
                },
                metadata: {},
            },
            {
                asset: "bb5e38d3da281634c8eade0a289651840e14802a7c04bba894a582c65f951b5fe386f8158f35d8a11de2520c86c17c2e8a1c61fb45297700ce8bf973",
                policyId:
                    "bb5e38d3da281634c8eade0a289651840e14802a7c04bba894a582c6",
                assetName:
                    "5f951b5fe386f8158f35d8a11de2520c86c17c2e8a1c61fb45297700ce8bf973",
                readableAssetName:
                    "_�\x1B_��\x15�5ء\x1D�R\f��|.�\x1Ca�E)w\x00΋�s",
                fingerprint: "asset100yepyqlt2ehdv2mvdt292a4q947lg5wv5phlh",
                quantity: 1,
                initialMintTxHash:
                    "4ae9ede13d3de6927e084c28da3109ac46fe46327b40bcf2613369b1003c453c",
                mintOrBurnCount: 1,
                onchainMetadata: {
                    ttl: 3195103530,
                    name: "5f951b5fe386f8158f35d8a11de2520c86c17c2e8a1c61fb45297700ce8bf973",
                    type: "credential",
                    files: [Object],
                    image: "ipfs://QmPnRTjGG7h8YKmVa94gyC3Yc1Xz1hf1uq4QZwgpeTq9D2",
                    index: 0,
                    owner: "cb4032a26e998a43c9bcb1e7dbe3e570492b79348e0eb9eb724fadb3930fcfdf",
                    attach: "5f951b5fe386f8158f35d8a11de2520c86c17c2e8a1c61fb45297700ce8bf973",
                    policy: "bb5e38d3da281634c8eade0a289651840e14802a7c04bba894a582c6",
                    mediaType: "image/png",
                    timestamp: 1697186972723,
                    description: "Fuixlab's credential",
                },
                originalOnchainMetadata: {
                    ttl: 3195103530,
                    name: "5f951b5fe386f8158f35d8a11de2520c86c17c2e8a1c61fb45297700ce8bf973",
                    type: "credential",
                    files: [Object],
                    image: "ipfs://QmPnRTjGG7h8YKmVa94gyC3Yc1Xz1hf1uq4QZwgpeTq9D2",
                    index: 0,
                    owner: "cb4032a26e998a43c9bcb1e7dbe3e570492b79348e0eb9eb724fadb3930fcfdf",
                    attach: "5f951b5fe386f8158f35d8a11de2520c86c17c2e8a1c61fb45297700ce8bf973",
                    policy: "bb5e38d3da281634c8eade0a289651840e14802a7c04bba894a582c6",
                    mediaType: "image/png",
                    timestamp: 1697186972723,
                    description: "Fuixlab's credential",
                },
                metadata: {},
            },
        ],
    },
    LASTEST_VERSION_RESPONSE: {
        code: 0,
        data: [
            {
                asset: "bb5e38d3da281634c8eade0a289651840e14802a7c04bba894a582c6cb4032a26e998a43c9bcb1e7dbe3e570492b79348e0eb9eb724fadb3930fcfdf",
                policyId:
                    "bb5e38d3da281634c8eade0a289651840e14802a7c04bba894a582c6",
                assetName: "fwefewfewfewfewfw",
                readableAssetName: "�@2�n��Cɼ�����pI+y4�\x0E��rO���\x0F��",
                fingerprint: "asset1dqmrfvjr7l98y7qu4p70ea0jkdfu9ulyjk4a78",
                quantity: 1,
                initialMintTxHash:
                    "030e9ccba3b428860aa67018450cae57d0107b0c2b977d78576f312bfde21ae0",
                mintOrBurnCount: 1,
                onchainMetadata: {
                    ttl: 3195103530,
                    name: "fwefewfewfewfewfw",
                    type: "document",
                    files: [Object],
                    image: "ipfs://QmPnRTjGG7h8YKmVa94gyC3Yc1Xz1hf1uq4QZwgpeTq9D2",
                    attach: "cb4032a26e998a43c9bcb1e7dbe3e570492b79348e0eb9eb724fadb3930fcfdf",
                    policy: "bb5e38d3da281634c8eade0a289651840e14802a7c04bba894a582c6",
                    version: 0,
                    mediaType: "image/png",
                    timestamp: 1697186730855,
                    description: "Fuixlab's wrap document",
                },
                originalOnchainMetadata: {
                    ttl: 3195103530,
                    name: "fwefewfewfewfewfw",
                    type: "document",
                    files: [Object],
                    image: "ipfs://QmPnRTjGG7h8YKmVa94gyC3Yc1Xz1hf1uq4QZwgpeTq9D2",
                    attach: "cb4032a26e998a43c9bcb1e7dbe3e570492b79348e0eb9eb724fadb3930fcfdf",
                    policy: "bb5e38d3da281634c8eade0a289651840e14802a7c04bba894a582c6",
                    version: 0,
                    mediaType: "image/png",
                    timestamp: 1697186730855,
                    description: "Fuixlab's wrap document",
                },
                metadata: {},
            },
            {
                asset: "bb5e38d3da281634c8eade0a289651840e14802a7c04bba894a582c6280406fb598c8a325806bbb93e63ee6e815d958c5e118a5eea471a84addc3271",
                policyId:
                    "bb5e38d3da281634c8eade0a289651840e14802a7c04bba894a582c6",
                assetName:
                    "cb4032a26e998a43c9bcb1e7dbe3e570492b79348e0eb9eb724fadb3930fcfdf",
                readableAssetName:
                    "(\x04\x06�Y��2X\x06��>c�n�]��^\x11�^�G\x1A���2q",
                fingerprint: "asset14rlv287jyvdvrf80rpnyhq96yqs25edqmglhx9",
                quantity: 1,
                initialMintTxHash:
                    "72195fcc7eb555bdd200f65978dd3bd8807d4412cf2c84618444f3d35f87eeb9",
                mintOrBurnCount: 1,
                onchainMetadata: {
                    ttl: 3195103530,
                    name: "280406fb598c8a325806bbb93e63ee6e815d958c5e118a5eea471a84addc3271",
                    type: "document",
                    files: [Object],
                    image: "ipfs://QmPnRTjGG7h8YKmVa94gyC3Yc1Xz1hf1uq4QZwgpeTq9D2",
                    attach: "280406fb598c8a325806bbb93e63ee6e815d958c5e118a5eea471a84addc3271",
                    policy: "bb5e38d3da281634c8eade0a289651840e14802a7c04bba894a582c6",
                    version: 1,
                    previous:
                        "cb4032a26e998a43c9bcb1e7dbe3e570492b79348e0eb9eb724fadb3930fcfdf",
                    mediaType: "image/png",
                    timestamp: 1697186941637,
                    description: "Fuixlab's Wrap Document",
                },
                originalOnchainMetadata: {
                    ttl: 3195103530,
                    name: "280406fb598c8a325806bbb93e63ee6e815d958c5e118a5eea471a84addc3271",
                    type: "document",
                    files: [Object],
                    image: "ipfs://QmPnRTjGG7h8YKmVa94gyC3Yc1Xz1hf1uq4QZwgpeTq9D2",
                    attach: "280406fb598c8a325806bbb93e63ee6e815d958c5e118a5eea471a84addc3271",
                    policy: "bb5e38d3da281634c8eade0a289651840e14802a7c04bba894a582c6",
                    version: 1,
                    previous:
                        "cb4032a26e998a43c9bcb1e7dbe3e570492b79348e0eb9eb724fadb3930fcfdf",
                    mediaType: "image/png",
                    timestamp: 1697186941637,
                    description: "Fuixlab's Wrap Document",
                },
                metadata: {},
            },
            {
                asset: "bb5e38d3da281634c8eade0a289651840e14802a7c04bba894a582c65f951b5fe386f8158f35d8a11de2520c86c17c2e8a1c61fb45297700ce8bf973",
                policyId:
                    "bb5e38d3da281634c8eade0a289651840e14802a7c04bba894a582c6",
                assetName:
                    "5f951b5fe386f8158f35d8a11de2520c86c17c2e8a1c61fb45297700ce8bf973",
                readableAssetName:
                    "_�\x1B_��\x15�5ء\x1D�R\f��|.�\x1Ca�E)w\x00΋�s",
                fingerprint: "asset100yepyqlt2ehdv2mvdt292a4q947lg5wv5phlh",
                quantity: 1,
                initialMintTxHash:
                    "4ae9ede13d3de6927e084c28da3109ac46fe46327b40bcf2613369b1003c453c",
                mintOrBurnCount: 1,
                onchainMetadata: {
                    ttl: 3195103530,
                    name: "5f951b5fe386f8158f35d8a11de2520c86c17c2e8a1c61fb45297700ce8bf973",
                    type: "credential",
                    files: [Object],
                    image: "ipfs://QmPnRTjGG7h8YKmVa94gyC3Yc1Xz1hf1uq4QZwgpeTq9D2",
                    index: 0,
                    owner: "cb4032a26e998a43c9bcb1e7dbe3e570492b79348e0eb9eb724fadb3930fcfdf",
                    attach: "5f951b5fe386f8158f35d8a11de2520c86c17c2e8a1c61fb45297700ce8bf973",
                    policy: "bb5e38d3da281634c8eade0a289651840e14802a7c04bba894a582c6",
                    mediaType: "image/png",
                    timestamp: 1697186972723,
                    description: "Fuixlab's credential",
                },
                originalOnchainMetadata: {
                    ttl: 3195103530,
                    name: "5f951b5fe386f8158f35d8a11de2520c86c17c2e8a1c61fb45297700ce8bf973",
                    type: "credential",
                    files: [Object],
                    image: "ipfs://QmPnRTjGG7h8YKmVa94gyC3Yc1Xz1hf1uq4QZwgpeTq9D2",
                    index: 0,
                    owner: "cb4032a26e998a43c9bcb1e7dbe3e570492b79348e0eb9eb724fadb3930fcfdf",
                    attach: "5f951b5fe386f8158f35d8a11de2520c86c17c2e8a1c61fb45297700ce8bf973",
                    policy: "bb5e38d3da281634c8eade0a289651840e14802a7c04bba894a582c6",
                    mediaType: "image/png",
                    timestamp: 1697186972723,
                    description: "Fuixlab's credential",
                },
                metadata: {},
            },
        ],
    },
};

export const CONTROLLER_RESPONSE = {
    ERROR: {
        error_code: 1,
        error_message: "Error from controller",
    },
    SUCCESS: {
        success: true,
        wrappedDoc: {
            data: {},
            signature: {
                targetHash:
                    "cb4032a26e998a43c9bcb1e7dbe3e570492b79348e0eb9eb724fadb3930fcfdf",
            },
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
        },
    },
    SUCCESS_WITHOUT_CONFIG: {
        wrappedDoc: {
            data: {},
            signature: {},
        },
    },
    IS_EXISTED: {
        isExisted: true,
    },
    IS_NOT_EXISTED: {
        isExisted: false,
    },
    VERIFIABLE_CREDENTIAL: {
        valid: true,
        data: {},
    },
    GET_DID_DOCUMENT_SUCCESS: {
        didDoc: {
            "@context": "https://www.w3.org/ns/did/v1",
            id: "did:cardano:1234567890abcdef",
        },
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
    BAD_REQUEST: {
        error_code: 4000,
        error_message: "Bad request.",
    },
    ADD_CLAIMANT_DATA_IS_EXISTED: {
        isExists: true,
        data: {
            verifiedCredential: {
                credentialSubject: {
                    id: "did:fuixlabs:COMMONLANDS_2:41dc24f184b647d4f204e81f4ec3f8034adbf42956bf30e17ad8f6f51e06159b",
                },
            },
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

export const WRAPPED_DOCUMENT_REQUEST = {
    INVALID_DOCUMENT: {
        plot: {},
        claimant: {},
    },
    VALID_DOCUMENT: {
        plot: {
            geojson: {
                geometry: {
                    type: "Polygon",
                    coordinates: [[]],
                },
                type: "Feature",
            },
            centroid: [31.98217150319044, 1.4638796809080243],
            _id: "64db86559e77a4ffc2395ada",
            area: 1216.42,
            placeName: "Nakasongola, Uganda",
            createdAt: 1692108373160,
            name: "VNZ-739",
            id: "Plot:64db86559e77a4ffc2395adc",
            isDisputed: true,
            isBoundaryDispute: false,
            isOwnershipDispute: true,
            disputes: [
                {
                    plot: {
                        geojson: {
                            geometry: {
                                type: "Polygon",
                                coordinates: [[]],
                            },
                            type: "Feature",
                        },
                        centroid: [31.982128510355498, 1.463785108729324],
                        _id: "64df16564b6bdbcb6559ebac",
                        area: 1106.31,
                        placeName: "Nakasongola, Uganda",
                        createdAt: 1692341846551,
                        name: "XTE-464",
                        id: "Plot:64df16564b6bdbcb6559ebae",
                        isBoundaryDispute: false,
                        isOwnershipDispute: true,
                    },
                    type: "ownership",
                },
            ],
            claimchainSize: 1,
        },
        claimant: {
            documentation: {
                nationalID: [],
                driverLicense: [],
                passport: [],
            },
            _id: "64db85b39e77a4ffc23959da",
            phoneNumber: "+14088960050",
            photoOfFace: "1692108209887-Darius%20Golkar.jpg",
            avatar: "https://commonlands-dev-bucket-aws.s3.us-west-1.amazonaws.com/1692108209887-Darius%2520Golkar.jpg_avatar?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAZBVJQENNESITE3MS%2F20230823%2Fus-west-1%2Fs3%2Faws4_request&X-Amz-Date=20230823T065041Z&X-Amz-Expires=604800&X-Amz-Signature=bc409ae32ddafef898259c211778e1c1750e0d340f6f0794028efcbf3377c472&X-Amz-SignedHeaders=host&x-id=GetObject",
            publicKey:
                "addr_test1qzj2pgqct6jwpvw7mjtjtess4nlmu385hzarszh9jxcv9eudvd5vt62wt4n97tqqcr43qs7d0v2eex2rkn763zzkys2swwrcxw",
            fullName: "Darius Golkar",
            gender: "male",
            lastLogin: 1692108211,
            firstLogin: false,
            createdAt: 1692108211874,
            did: "did:user:addr_test1qzj2pgqct6jwpvw7mjtjtess4nlmu385hzarszh9jxcv9eudvd5vt62wt4n97tqqcr43qs7d0v2eex2rkn763zzkys2swwrcxw",
            oldNumbers: [],
            role: "owner",
        },
    },
};
