import { ERRORS } from "../../errors/error.constants.js";

export const getDocumentInformation = {
    get: {
        tags: ["Commonlands Document"],
        summary: "Get document information",
        parameters: [
            {
                name: "did",
                in: "path",
                schema: {
                    type: "string",
                    example:
                        "did:fuixlabs:COMMONLANDS_2:LandCertification-64db86559e77a4ffc2395ada_119",
                },
                required: true,
                description: "DID of the certificate",
            },
        ],
        responses: {
            200: {
                description:
                    "Return an object include document information if success",
                content: {
                    "application/json": {
                        examples: {
                            "Get PDF file successfully": {
                                value: {
                                    success: true,
                                    url: "https://raw.githubusercontent.com/dev-fuixlabs/Commonlands_DOC/IMAGE/1695204643781_TESTING_COMMONLANDS-LandCertificate-14088960050-64db86559e77a4ffc2395ada_103.pdf",
                                },
                            },
                            "Missing parameters": {
                                value: {
                                    error_code: 400,
                                    error_message:
                                        "Bad request. Missing parameters.",
                                    detail: "Not found: did",
                                },
                            },
                            "Invalid DID": {
                                value: {
                                    error_code: 400,
                                    error_message: "Invalid DID",
                                },
                            },
                            "Cannot get document information": {
                                value: {
                                    error_code: 400,
                                    error_message:
                                        "Cannot get document information",
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};

export const commonlandsPlotCertificate = {
    post: {
        tags: ["Commonlands Document"],
        summary:
            "Generate a Plot Certificate for the Commonlands Project. This function serves as a wrapper for the DID Document",
        requestBody: {
            require: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            plot: {
                                type: "object",
                                example: {
                                    geojson: {
                                        geometry: {
                                            type: "Polygon",
                                            coordinates: [
                                                [
                                                    [
                                                        32.89857143565689,
                                                        2.244113833686839,
                                                    ],
                                                ],
                                            ],
                                        },
                                        type: "Feature",
                                    },
                                    centroid: [
                                        32.89915257008554, 2.2442339154750854,
                                    ],
                                    _id: "6523a50b6824bd6a3de9a562",
                                    area: 6890.1,
                                    placeName: "Bazaar East, Lira, Uganda",
                                    status: "F&C",
                                    creatorID: "65239fbf6824bd6a3de9a4da",
                                    createdAt: 1696834827854,
                                    name: "CLZ-398",
                                    id: "Plot:6523a50b6824bd6a3de9a564",
                                    did: null,
                                    isDisputed: false,
                                    isIssued: false,
                                    isBoundaryDispute: false,
                                    isOwnershipDispute: false,
                                    disputes: [],
                                    neighbors: [
                                        {
                                            _id: "6523ad82e70425ff378a46a2",
                                            plotA: "6523a50b6824bd6a3de9a562",
                                            plotB: "6523ace3e70425ff378a45dd",
                                            createdAt: 1696836994157,
                                            __v: 0,
                                        },
                                        {
                                            _id: "6523aecbe70425ff378a48a5",
                                            plotA: "6523ae5be70425ff378a482d",
                                            plotB: "6523a50b6824bd6a3de9a562",
                                            createdAt: 1696837323892,
                                            __v: 0,
                                        },
                                    ],
                                    claimants: [
                                        {
                                            documentation: {
                                                nationalID: [],
                                                driverLicense: [],
                                                passport: [],
                                            },
                                            _id: "65239fbf6824bd6a3de9a4da",
                                            publicKey:
                                                "addr_test1qzz85cplvzxvx0scjj6gfj0w2rq3km4g2s6ag9yq7ptpxjasmrsqazt6hlxsh6d58xz0w0y05nq7awjpsmzn5dsy5gls7a53ut",
                                            phoneNumber: "+84311111190",
                                            fullName: "90",
                                            did: "did:fuixlabs:commonlands:addr_test1qzz85cplvzxvx0scjj6gfj0w2rq3km4g2s6ag9yq7ptpxjasmrsqazt6hlxsh6d58xz0w0y05nq7awjpsmzn5dsy5gls7a53ut",
                                            gender: "male",
                                            lastLogin: 1696841941,
                                            firstLogin: false,
                                            oldNumbers: [],
                                            createdAt: 1696833471144,
                                            blockedPlots: [],
                                            avatar: "https://commonlands-dev-bucket-aws.s3.us-west-1.amazonaws.com/1696833471171-avatar_90.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAZBVJQENNESITE3MS%2F20231009%2Fus-west-1%2Fs3%2Faws4_request&X-Amz-Date=20231009T085839Z&X-Amz-Expires=604800&X-Amz-Signature=0d0ead359bbcb8ce98e0e65a6133158d6f9e155c832cbee5a4356c296d5d2198&X-Amz-SignedHeaders=host&x-id=GetObject",
                                            photoOfFace: "1696833471170-90.jpg",
                                            role: "owner",
                                            landCertificateStatus: "awaiting",
                                            claimsVC: null,
                                            claimantID:
                                                "6523a50b6824bd6a3de9a566",
                                        },
                                        {
                                            documentation: {
                                                nationalID: [],
                                                driverLicense: [],
                                                passport: [],
                                            },
                                            _id: "65239fbf6824bd6a3de9a4da_2",
                                            publicKey:
                                                "addr_test1qzz85cplvzxvx0scjj6gfj0w2rq3km4g2s6ag9yq7ptpxjasmrsqazt6hlxsh6d58xz0w0y05nq7awjpsmzn5dsy5gls7a53ut2",
                                            phoneNumber: "+843111111902",
                                            fullName: "902",
                                            did: "did:fuixlabs:commonlands:addr_test1qzz85cplvzxvx0scjj6gfj0w2rq3km4g2s6ag9yq7ptpxjasmrsqazt6hlxsh6d58xz0w0y05nq7awjpsmzn5dsy5gls7a53ut2",
                                            gender: "male",
                                            lastLogin: 1696841941,
                                            firstLogin: false,
                                            oldNumbers: [],
                                            createdAt: 1696833471144,
                                            blockedPlots: [],
                                            avatar: "https://commonlands-dev-bucket-aws.s3.us-west-1.amazonaws.com/1696833471171-avatar_90.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAZBVJQENNESITE3MS%2F20231009%2Fus-west-1%2Fs3%2Faws4_request&X-Amz-Date=20231009T085839Z&X-Amz-Expires=604800&X-Amz-Signature=0d0ead359bbcb8ce98e0e65a6133158d6f9e155c832cbee5a4356c296d5d2198&X-Amz-SignedHeaders=host&x-id=GetObject",
                                            photoOfFace: "1696833471170-90.jpg",
                                            role: "owner",
                                            landCertificateStatus: "awaiting",
                                            claimsVC: null,
                                            claimantID:
                                                "6523a50b6824bd6a3de9a566",
                                        },
                                    ],
                                    claimchainSize: 7,
                                },
                            },
                        },
                    },
                },
            },
        },
        responses: {
            200: {
                description:
                    "Return an array include credential'hashes if success",
                content: {
                    "application/json": {
                        examples: {
                            "Create plot certificate successfully": {
                                value: {
                                    hashes: [
                                        "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z",
                                    ],
                                },
                            },
                            "Missing parameters": {
                                value: {
                                    error_code: 400,
                                    error_message:
                                        "Bad request. Missing parameters.",
                                    detail: "Not found: owner",
                                },
                            },
                            "Document already exists": {
                                value: {
                                    url: "https://raw.githubusercontent.com/dev-fuixlabs/Commonlands_DOC/IMAGE/1692991473198_COMMONLANDS_2-LandCertificate-14088960050-64db86559e77a4ffc2395ada-30.pdf",
                                    isExisted: true,
                                },
                            },
                            "Cannot mint nft for credential": {
                                value: ERRORS.CANNOT_CREATE_CREDENTIAL_FOR_CLAIMANT,
                            },
                        },
                    },
                },
            },
        },
    },
    put: {
        tags: ["Commonlands Document"],
        summary:
            "Update a Plot Certificate for the Commonlands Project. This function serves as a wrapper for the DID Document",
        requestBody: {
            require: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            plot: {
                                type: "object",
                                example: {
                                    geojson: {
                                        geometry: {
                                            type: "Polygon",
                                            coordinates: [
                                                [
                                                    [
                                                        32.89857143565689,
                                                        2.244113833686839,
                                                    ],
                                                    [
                                                        32.89900324832544,
                                                        2.2446677211748494,
                                                    ],
                                                    [
                                                        32.89970011569531,
                                                        2.2443908435462276,
                                                    ],
                                                    [
                                                        32.89933548066452,
                                                        2.2437632634924256,
                                                    ],
                                                    [
                                                        32.89857143565689,
                                                        2.244113833686839,
                                                    ],
                                                ],
                                            ],
                                        },
                                        type: "Feature",
                                    },
                                    centroid: [
                                        32.89915257008554, 2.2442339154750854,
                                    ],
                                    _id: "6523a50b6824bd6a3de9a562",
                                    area: 6890.1,
                                    placeName: "Bazaar East, Lira, Uganda",
                                    status: "F&C",
                                    creatorID: "65239fbf6824bd6a3de9a4da",
                                    createdAt: 1696834827854,
                                    name: "CLZ-398",
                                    id: "Plot:6523a50b6824bd6a3de9a564",
                                    did: null,
                                    isDisputed: false,
                                    isIssued: false,
                                    isBoundaryDispute: false,
                                    isOwnershipDispute: false,
                                    disputes: [],
                                    neighbors: [
                                        {
                                            _id: "6523ad82e70425ff378a46a2",
                                            plotA: "6523a50b6824bd6a3de9a562",
                                            plotB: "6523ace3e70425ff378a45dd",
                                            createdAt: 1696836994157,
                                            __v: 0,
                                        },
                                        {
                                            _id: "6523aecbe70425ff378a48a5",
                                            plotA: "6523ae5be70425ff378a482d",
                                            plotB: "6523a50b6824bd6a3de9a562",
                                            createdAt: 1696837323892,
                                            __v: 0,
                                        },
                                    ],
                                    claimants: [
                                        {
                                            documentation: {
                                                nationalID: [],
                                                driverLicense: [],
                                                passport: [],
                                            },
                                            _id: "65239fbf6824bd6a3de9a4da",
                                            publicKey:
                                                "addr_test1qzz85cplvzxvx0scjj6gfj0w2rq3km4g2s6ag9yq7ptpxjasmrsqazt6hlxsh6d58xz0w0y05nq7awjpsmzn5dsy5gls7a53ut",
                                            phoneNumber: "+84311111190",
                                            fullName: "90",
                                            did: "did:fuixlabs:commonlands:addr_test1qzz85cplvzxvx0scjj6gfj0w2rq3km4g2s6ag9yq7ptpxjasmrsqazt6hlxsh6d58xz0w0y05nq7awjpsmzn5dsy5gls7a53ut",
                                            gender: "male",
                                            lastLogin: 1696841941,
                                            firstLogin: false,
                                            oldNumbers: [],
                                            createdAt: 1696833471144,
                                            blockedPlots: [],
                                            avatar: "https://commonlands-dev-bucket-aws.s3.us-west-1.amazonaws.com/1696833471171-avatar_90.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAZBVJQENNESITE3MS%2F20231009%2Fus-west-1%2Fs3%2Faws4_request&X-Amz-Date=20231009T085839Z&X-Amz-Expires=604800&X-Amz-Signature=0d0ead359bbcb8ce98e0e65a6133158d6f9e155c832cbee5a4356c296d5d2198&X-Amz-SignedHeaders=host&x-id=GetObject",
                                            photoOfFace: "1696833471170-90.jpg",
                                            role: "owner",
                                            landCertificateStatus: "awaiting",
                                            claimsVC: null,
                                            claimantID:
                                                "6523a50b6824bd6a3de9a566",
                                        },
                                    ],
                                    claimchainSize: 7,
                                },
                            },
                        },
                    },
                },
            },
        },
        responses: {
            200: {
                description:
                    "Return an array include credential'hashes if success",
                content: {
                    "application/json": {
                        examples: {
                            "Update plot certificate successfully": {
                                value: {
                                    credentials: [],
                                    certificateDid:
                                        "did:fuixlabs:COMMONLANDS_2:PlotCertification-64db86559e77a4ffc2395ada_119",
                                },
                            },
                            "Missing parameters": {
                                value: {
                                    ...ERRORS.MISSING_PARAMETERS,
                                    detail: "Not found: owner",
                                },
                            },
                            "Document already exists": {
                                value: ERRORS.DOCUMENT_IS_EXISTED,
                            },
                            "Cannot mint nft for credential": {
                                value: ERRORS.CANNOT_CREATE_CREDENTIAL_FOR_CLAIMANT,
                            },
                            "DID is not valid": {
                                value: ERRORS.INVALID_DID,
                            },
                            "Cannot update document": {
                                value: ERRORS.CANNOT_UPDATE_DOCUMENT_INFORMATION,
                            },
                            "Cannot found document": {
                                value: ERRORS.CANNOT_FOUND_DID_DOCUMENT,
                            },
                            "Cannot create credential": {
                                value: ERRORS.CREDENTIAL_FAILED,
                            },
                        },
                    },
                },
            },
        },
    },
    delete: {
        tags: ["Commonlands Document"],
        summary:
            "Delete a Plot Certificate for the Commonlands Project. This function serves as a wrapper for the DID Document",
        requestBody: {
            require: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            did: {
                                type: "string",
                            },
                        },
                    },
                },
            },
        },
        responses: {
            200: {
                description:
                    "Return an array include credential'hashes if success",
            },
        },
    },
};

export const hashDocumentContent = {
    post: {
        tags: ["Commonlands Document"],
        summary:
            "Hash a Land Certificate for the Commonlands Project using given contract information",
        requestBody: {
            require: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            plot: {
                                type: "object",
                                example: {
                                    geojson: {
                                        geometry: {
                                            type: "Polygon",
                                            coordinates: [
                                                [
                                                    [
                                                        31.98189641838985,
                                                        1.46410111221806,
                                                    ],
                                                    [
                                                        31.982118613007515,
                                                        1.4639804317163083,
                                                    ],
                                                    [
                                                        31.982179847744703,
                                                        1.463763556594884,
                                                    ],
                                                    [
                                                        31.982376575336104,
                                                        1.4635196171409035,
                                                    ],
                                                    [
                                                        31.982473607268105,
                                                        1.4637163726349343,
                                                    ],
                                                    [
                                                        31.981983957396352,
                                                        1.4641969951430553,
                                                    ],
                                                    [
                                                        31.98189641838985,
                                                        1.46410111221806,
                                                    ],
                                                ],
                                            ],
                                        },
                                        type: "Feature",
                                    },
                                    centroid: [
                                        31.98217150319044, 1.4638796809080243,
                                    ],
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
                                                        coordinates: [
                                                            [
                                                                [
                                                                    31.98234437709405,
                                                                    1.4634632209726135,
                                                                ],
                                                                [
                                                                    31.982375037267257,
                                                                    1.463521524324699,
                                                                ],
                                                                [
                                                                    31.982179847744703,
                                                                    1.463763556594884,
                                                                ],
                                                                [
                                                                    31.9821169752085,
                                                                    1.4639828740821343,
                                                                ],
                                                                [
                                                                    31.981902153285628,
                                                                    1.464097997425691,
                                                                ],
                                                                [
                                                                    31.98181110302778,
                                                                    1.4640200251540705,
                                                                ],
                                                                [
                                                                    31.982170078860577,
                                                                    1.463646562551176,
                                                                ],
                                                                [
                                                                    31.98234437709405,
                                                                    1.4634632209726135,
                                                                ],
                                                            ],
                                                        ],
                                                    },
                                                    type: "Feature",
                                                },
                                                centroid: [
                                                    31.982128510355498,
                                                    1.463785108729324,
                                                ],
                                                _id: "64df16564b6bdbcb6559ebac",
                                                area: 1106.31,
                                                placeName:
                                                    "Nakasongola, Uganda",
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
                            },
                            claimant: {
                                type: "object",
                                example: {
                                    documentation: {
                                        nationalID: [],
                                        driverLicense: [],
                                        passport: [],
                                    },
                                    _id: "64db85b39e77a4ffc23959da",
                                    phoneNumber: "+14088960050",
                                    photoOfFace:
                                        "1692108209887-Darius%20Golkar.jpg",
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
                        },
                    },
                },
            },
        },
        responses: {
            200: {
                description: "Return a target hash if success",
                content: {
                    "application/json": {
                        examples: {
                            "Hash document content successfully": {
                                value: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z",
                            },
                            "Missing parameters": {
                                value: {
                                    error_code: 400,
                                    error_message:
                                        "Bad request. Missing parameters.",
                                    detail: "Not found: owner",
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};

export const revokeCommonlandsDocument = {
    post: {
        tags: ["Commonlands Document"],
        summary:
            "Revoke a Land Certificate for the Commonlands Project using either a URL or a minting configuration.",
        requestBody: {
            require: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            url: {
                                type: "string",
                                example:
                                    "https://raw.githubusercontent.com/dev-fuixlabs/Commonlands_DOC/IMAGE/1692991473198_COMMONLANDS_2-LandCertificate-14088960050-64db86559e77a4ffc2395ada-30.pdf",
                            },
                        },
                    },
                },
            },
        },
        responses: {
            200: {
                description:
                    "Return an object include revoked is true if success",
                content: {
                    "application/json": {
                        examples: {
                            "Revoke document Successfully": {
                                value: {
                                    revoked: true,
                                },
                            },
                            "Missing parameters": {
                                value: {
                                    error_code: 400,
                                    error_message:
                                        "Bad request. Missing parameters.",
                                    detail: "Not found: owner",
                                },
                            },
                            "Revoke document failed": {
                                value: {
                                    error_code: 400,
                                    error_message:
                                        "Bad request. Revoke document failed.",
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};

export const addClaimantToDocument = {
    post: {
        tags: ["Commonlands Document"],
        summary:
            "Add a claimant to a Land Certificate for the Commonlands Project using either a URL or a minting configuration.",
        requestBody: {
            require: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            plotDid: {
                                type: "string",
                                example:
                                    "did:fuixlabs:COMMONLANDS_2:64db86559e77a4ffc2395ada",
                            },
                            claimant: {
                                type: "object",
                                example: {
                                    documentation: {
                                        nationalID: [],
                                        driverLicense: [],
                                        passport: [],
                                    },
                                    _id: "5f45cfdbfbb6cf2f7002a5621_1",
                                    publicKey:
                                        "addr_test1qp7abcd1234efgh5678ijkl90mnopqrstuvwx",
                                    phoneNumber: "+1987654321",
                                    fullName: "John Doe",
                                    did: "did:user:addr_test1qp7abcd1234efgh5678ijkl90mnopqrstuvwx",
                                    gender: "male",
                                    photoOfFace: "1234567890-John%20Doe.jpg",
                                    avatar: "https://aws-storage.s3.region-7.amazonaws.com/1234567890-John%20Doe.jpg_avatar",
                                    lastLogin: 1692263912,
                                    firstLogin: false,
                                    createdAt: 1692263912031,
                                    oldNumbers: [],
                                    blockedPlots: [],
                                    role: "renter",
                                },
                            },
                        },
                    },
                },
            },
        },
        responses: {
            200: {
                description:
                    "Return an object include revoked is true if success",
                content: {
                    "application/json": {
                        examples: {
                            "Add claimant to document successfully": {
                                value: {
                                    success: true,
                                },
                            },
                            "Missing parameters": {
                                value: {
                                    error_code: 400,
                                    error_message:
                                        "Bad request. Missing parameters.",
                                    detail: "Not found: owner",
                                },
                            },
                            "Add claimant to document failed": {
                                value: {
                                    error_code: 400,
                                    error_message:
                                        "Bad request. Add claimant to document failed.",
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};

export const commonlandsPlotCertificateV2 = {
    post: {
        tags: ["Commonlands Document"],
        summary:
            "Generate a Plot Certificate for the Commonlands Project. This function serves as a wrapper for the DID Document",
        requestBody: {
            require: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            plot: {
                                type: "object",
                                example: {
                                    geojson: {
                                        geometry: {
                                            type: "Polygon",
                                            coordinates: [
                                                [
                                                    [
                                                        32.89857143565689,
                                                        2.244113833686839,
                                                    ],
                                                ],
                                            ],
                                        },
                                        type: "Feature",
                                    },
                                    centroid: [
                                        32.89915257008554, 2.2442339154750854,
                                    ],
                                    _id: "6523a50b6824bd6a3de9a562",
                                    area: 6890.1,
                                    placeName: "Bazaar East, Lira, Uganda",
                                    status: "F&C",
                                    creatorID: "65239fbf6824bd6a3de9a4da",
                                    createdAt: 1696834827854,
                                    name: "CLZ-398",
                                    id: "Plot:6523a50b6824bd6a3de9a564",
                                    did: null,
                                    isDisputed: false,
                                    isIssued: false,
                                    isBoundaryDispute: false,
                                    isOwnershipDispute: false,
                                    disputes: [],
                                    neighbors: [
                                        {
                                            _id: "6523ad82e70425ff378a46a2",
                                            plotA: "6523a50b6824bd6a3de9a562",
                                            plotB: "6523ace3e70425ff378a45dd",
                                            createdAt: 1696836994157,
                                            __v: 0,
                                        },
                                        {
                                            _id: "6523aecbe70425ff378a48a5",
                                            plotA: "6523ae5be70425ff378a482d",
                                            plotB: "6523a50b6824bd6a3de9a562",
                                            createdAt: 1696837323892,
                                            __v: 0,
                                        },
                                    ],
                                    claimants: [
                                        {
                                            documentation: {
                                                nationalID: [],
                                                driverLicense: [],
                                                passport: [],
                                            },
                                            _id: "65239fbf6824bd6a3de9a4da",
                                            publicKey:
                                                "addr_test1qzz85cplvzxvx0scjj6gfj0w2rq3km4g2s6ag9yq7ptpxjasmrsqazt6hlxsh6d58xz0w0y05nq7awjpsmzn5dsy5gls7a53ut",
                                            phoneNumber: "+84311111190",
                                            fullName: "90",
                                            did: "did:fuixlabs:commonlands:addr_test1qzz85cplvzxvx0scjj6gfj0w2rq3km4g2s6ag9yq7ptpxjasmrsqazt6hlxsh6d58xz0w0y05nq7awjpsmzn5dsy5gls7a53ut",
                                            gender: "male",
                                            lastLogin: 1696841941,
                                            firstLogin: false,
                                            oldNumbers: [],
                                            createdAt: 1696833471144,
                                            blockedPlots: [],
                                            avatar: "https://commonlands-dev-bucket-aws.s3.us-west-1.amazonaws.com/1696833471171-avatar_90.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAZBVJQENNESITE3MS%2F20231009%2Fus-west-1%2Fs3%2Faws4_request&X-Amz-Date=20231009T085839Z&X-Amz-Expires=604800&X-Amz-Signature=0d0ead359bbcb8ce98e0e65a6133158d6f9e155c832cbee5a4356c296d5d2198&X-Amz-SignedHeaders=host&x-id=GetObject",
                                            photoOfFace: "1696833471170-90.jpg",
                                            role: "owner",
                                            landCertificateStatus: "awaiting",
                                            claimsVC: null,
                                            claimantID:
                                                "6523a50b6824bd6a3de9a566",
                                        },
                                        {
                                            documentation: {
                                                nationalID: [],
                                                driverLicense: [],
                                                passport: [],
                                            },
                                            _id: "65239fbf6824bd6a3de9a4da_2",
                                            publicKey:
                                                "addr_test1qzz85cplvzxvx0scjj6gfj0w2rq3km4g2s6ag9yq7ptpxjasmrsqazt6hlxsh6d58xz0w0y05nq7awjpsmzn5dsy5gls7a53ut2",
                                            phoneNumber: "+843111111902",
                                            fullName: "902",
                                            did: "did:fuixlabs:commonlands:addr_test1qzz85cplvzxvx0scjj6gfj0w2rq3km4g2s6ag9yq7ptpxjasmrsqazt6hlxsh6d58xz0w0y05nq7awjpsmzn5dsy5gls7a53ut2",
                                            gender: "male",
                                            lastLogin: 1696841941,
                                            firstLogin: false,
                                            oldNumbers: [],
                                            createdAt: 1696833471144,
                                            blockedPlots: [],
                                            avatar: "https://commonlands-dev-bucket-aws.s3.us-west-1.amazonaws.com/1696833471171-avatar_90.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAZBVJQENNESITE3MS%2F20231009%2Fus-west-1%2Fs3%2Faws4_request&X-Amz-Date=20231009T085839Z&X-Amz-Expires=604800&X-Amz-Signature=0d0ead359bbcb8ce98e0e65a6133158d6f9e155c832cbee5a4356c296d5d2198&X-Amz-SignedHeaders=host&x-id=GetObject",
                                            photoOfFace: "1696833471170-90.jpg",
                                            role: "owner",
                                            landCertificateStatus: "awaiting",
                                            claimsVC: null,
                                            claimantID:
                                                "6523a50b6824bd6a3de9a566",
                                        },
                                    ],
                                    claimchainSize: 7,
                                },
                            },
                        },
                    },
                },
            },
        },
        responses: {
            200: {
                description:
                    "Return an array include credential'hashes if success",
                content: {
                    "application/json": {
                        examples: {
                            "Create plot certificate successfully": {
                                value: {
                                    hashes: [
                                        "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z",
                                    ],
                                },
                            },
                            "Missing parameters": {
                                value: {
                                    error_code: 400,
                                    error_message:
                                        "Bad request. Missing parameters.",
                                    detail: "Not found: owner",
                                },
                            },
                            "Document already exists": {
                                value: {
                                    url: "https://raw.githubusercontent.com/dev-fuixlabs/Commonlands_DOC/IMAGE/1692991473198_COMMONLANDS_2-LandCertificate-14088960050-64db86559e77a4ffc2395ada-30.pdf",
                                    isExisted: true,
                                },
                            },
                            "Cannot mint nft for credential": {
                                value: ERRORS.CANNOT_CREATE_CREDENTIAL_FOR_CLAIMANT,
                            },
                        },
                    },
                },
            },
        },
    },
    put: {
        tags: ["Commonlands Document"],
        summary:
            "Update a Plot Certificate for the Commonlands Project. This function serves as a wrapper for the DID Document",
        requestBody: {
            require: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            plot: {
                                type: "object",
                                example: {
                                    geojson: {
                                        geometry: {
                                            type: "Polygon",
                                            coordinates: [
                                                [
                                                    [
                                                        32.89857143565689,
                                                        2.244113833686839,
                                                    ],
                                                    [
                                                        32.89900324832544,
                                                        2.2446677211748494,
                                                    ],
                                                    [
                                                        32.89970011569531,
                                                        2.2443908435462276,
                                                    ],
                                                    [
                                                        32.89933548066452,
                                                        2.2437632634924256,
                                                    ],
                                                    [
                                                        32.89857143565689,
                                                        2.244113833686839,
                                                    ],
                                                ],
                                            ],
                                        },
                                        type: "Feature",
                                    },
                                    centroid: [
                                        32.89915257008554, 2.2442339154750854,
                                    ],
                                    _id: "6523a50b6824bd6a3de9a562",
                                    area: 6890.1,
                                    placeName: "Bazaar East, Lira, Uganda",
                                    status: "F&C",
                                    creatorID: "65239fbf6824bd6a3de9a4da",
                                    createdAt: 1696834827854,
                                    name: "CLZ-398",
                                    id: "Plot:6523a50b6824bd6a3de9a564",
                                    did: null,
                                    isDisputed: false,
                                    isIssued: false,
                                    isBoundaryDispute: false,
                                    isOwnershipDispute: false,
                                    disputes: [],
                                    neighbors: [
                                        {
                                            _id: "6523ad82e70425ff378a46a2",
                                            plotA: "6523a50b6824bd6a3de9a562",
                                            plotB: "6523ace3e70425ff378a45dd",
                                            createdAt: 1696836994157,
                                            __v: 0,
                                        },
                                        {
                                            _id: "6523aecbe70425ff378a48a5",
                                            plotA: "6523ae5be70425ff378a482d",
                                            plotB: "6523a50b6824bd6a3de9a562",
                                            createdAt: 1696837323892,
                                            __v: 0,
                                        },
                                    ],
                                    claimants: [
                                        {
                                            documentation: {
                                                nationalID: [],
                                                driverLicense: [],
                                                passport: [],
                                            },
                                            _id: "65239fbf6824bd6a3de9a4da",
                                            publicKey:
                                                "addr_test1qzz85cplvzxvx0scjj6gfj0w2rq3km4g2s6ag9yq7ptpxjasmrsqazt6hlxsh6d58xz0w0y05nq7awjpsmzn5dsy5gls7a53ut",
                                            phoneNumber: "+84311111190",
                                            fullName: "90",
                                            did: "did:fuixlabs:commonlands:addr_test1qzz85cplvzxvx0scjj6gfj0w2rq3km4g2s6ag9yq7ptpxjasmrsqazt6hlxsh6d58xz0w0y05nq7awjpsmzn5dsy5gls7a53ut",
                                            gender: "male",
                                            lastLogin: 1696841941,
                                            firstLogin: false,
                                            oldNumbers: [],
                                            createdAt: 1696833471144,
                                            blockedPlots: [],
                                            avatar: "https://commonlands-dev-bucket-aws.s3.us-west-1.amazonaws.com/1696833471171-avatar_90.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAZBVJQENNESITE3MS%2F20231009%2Fus-west-1%2Fs3%2Faws4_request&X-Amz-Date=20231009T085839Z&X-Amz-Expires=604800&X-Amz-Signature=0d0ead359bbcb8ce98e0e65a6133158d6f9e155c832cbee5a4356c296d5d2198&X-Amz-SignedHeaders=host&x-id=GetObject",
                                            photoOfFace: "1696833471170-90.jpg",
                                            role: "owner",
                                            landCertificateStatus: "awaiting",
                                            claimsVC: null,
                                            claimantID:
                                                "6523a50b6824bd6a3de9a566",
                                        },
                                        {
                                            documentation: {
                                                nationalID: [],
                                                driverLicense: [],
                                                passport: [],
                                            },
                                            _id: "65239fbf6824bd6a3de9a4da_2",
                                            publicKey:
                                                "addr_test1qzz85cplvzxvx0scjj6gfj0w2rq3km4g2s6ag9yq7ptpxjasmrsqazt6hlxsh6d58xz0w0y05nq7awjpsmzn5dsy5gls7a53u_2t",
                                            phoneNumber: "+84311111190",
                                            fullName: "90",
                                            did: "did:fuixlabs:commonlands:addr_test1qzz85cplvzxvx0scjj6gfj0w2rq3km4g2s6ag9yq7ptpxjasmrsqazt6hlxsh6d58xz0w0y05nq7awjpsmzn5dsy5gls7a53ut_2",
                                            gender: "male",
                                            lastLogin: 1696841941,
                                            firstLogin: false,
                                            oldNumbers: [],
                                            createdAt: 1696833471144,
                                            blockedPlots: [],
                                            avatar: "https://commonlands-dev-bucket-aws.s3.us-west-1.amazonaws.com/1696833471171-avatar_90.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAZBVJQENNESITE3MS%2F20231009%2Fus-west-1%2Fs3%2Faws4_request&X-Amz-Date=20231009T085839Z&X-Amz-Expires=604800&X-Amz-Signature=0d0ead359bbcb8ce98e0e65a6133158d6f9e155c832cbee5a4356c296d5d2198&X-Amz-SignedHeaders=host&x-id=GetObject",
                                            photoOfFace: "1696833471170-90.jpg",
                                            role: "owner",
                                            landCertificateStatus: "awaiting",
                                            claimsVC: null,
                                            claimantID:
                                                "6523a50b6824bd6a3de9a566",
                                        },
                                    ],
                                    claimchainSize: 7,
                                },
                            },
                        },
                    },
                },
            },
        },
        responses: {
            200: {
                description:
                    "Return an array include credential'hashes if success",
                content: {
                    "application/json": {
                        examples: {
                            "Update plot certificate successfully": {
                                value: {
                                    credentials: [],
                                    certificateDid:
                                        "did:fuixlabs:COMMONLANDS_2:PlotCertification-64db86559e77a4ffc2395ada_119",
                                },
                            },
                            "Missing parameters": {
                                value: {
                                    ...ERRORS.MISSING_PARAMETERS,
                                    detail: "Not found: owner",
                                },
                            },
                            "Document already exists": {
                                value: ERRORS.DOCUMENT_IS_EXISTED,
                            },
                            "Cannot mint nft for credential": {
                                value: ERRORS.CANNOT_CREATE_CREDENTIAL_FOR_CLAIMANT,
                            },
                            "DID is not valid": {
                                value: ERRORS.INVALID_DID,
                            },
                            "Cannot update document": {
                                value: ERRORS.CANNOT_UPDATE_DOCUMENT_INFORMATION,
                            },
                            "Cannot found document": {
                                value: ERRORS.CANNOT_FOUND_DID_DOCUMENT,
                            },
                            "Cannot create credential": {
                                value: ERRORS.CREDENTIAL_FAILED,
                            },
                        },
                    },
                },
            },
        },
    },
    delete: {
        tags: ["Commonlands Document"],
        summary:
            "Delete a Plot Certificate for the Commonlands Project. This function serves as a wrapper for the DID Document",
        requestBody: {
            require: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            did: {
                                type: "string",
                            },
                        },
                    },
                },
            },
        },
        responses: {
            200: {
                description:
                    "Return an array include credential'hashes if success",
            },
        },
    },
};
export const addClaimantToDocumentV2 = {
    post: {
        tags: ["Commonlands Document"],
        summary:
            "Add a claimant to a Land Certificate for the Commonlands Project using either a URL or a minting configuration.",
        requestBody: {
            require: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            plotDid: {
                                type: "string",
                                example:
                                    "did:fuixlabs:COMMONLANDS_2:64db86559e77a4ffc2395ada",
                            },
                            claimant: {
                                type: "object",
                                example: {
                                    documentation: {
                                        nationalID: [],
                                        driverLicense: [],
                                        passport: [],
                                    },
                                    _id: "5f45cfdbfbb6cf2f7002a5621_1",
                                    publicKey:
                                        "addr_test1qp7abcd1234efgh5678ijkl90mnopqrstuvwx",
                                    phoneNumber: "+1987654321",
                                    fullName: "John Doe",
                                    did: "did:user:addr_test1qp7abcd1234efgh5678ijkl90mnopqrstuvwx",
                                    gender: "male",
                                    photoOfFace: "1234567890-John%20Doe.jpg",
                                    avatar: "https://aws-storage.s3.region-7.amazonaws.com/1234567890-John%20Doe.jpg_avatar",
                                    lastLogin: 1692263912,
                                    firstLogin: false,
                                    createdAt: 1692263912031,
                                    oldNumbers: [],
                                    blockedPlots: [],
                                    role: "renter",
                                },
                            },
                        },
                    },
                },
            },
        },
        responses: {
            200: {
                description:
                    "Return an object include revoked is true if success",
                content: {
                    "application/json": {
                        examples: {
                            "Add claimant to document successfully": {
                                value: {
                                    success: true,
                                },
                            },
                            "Missing parameters": {
                                value: {
                                    error_code: 400,
                                    error_message:
                                        "Bad request. Missing parameters.",
                                    detail: "Not found: owner",
                                },
                            },
                            "Add claimant to document failed": {
                                value: {
                                    error_code: 400,
                                    error_message:
                                        "Bad request. Add claimant to document failed.",
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};
