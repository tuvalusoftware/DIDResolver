import { ERRORS } from "../../constants.js";

export const commonlandsDocument = {
  post: {
    tags: ["Commonlands Document"],
    summary:
      "Generate a Land Certificate for the Commonlands Project. This function serves as a wrapper for the DID Document",
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
                      coordinates: [],
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
                            coordinates: [],
                          },
                          type: "Feature",
                        },
                        centroid: [],
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
              },
              owner: {
                type: "object",
                example: {
                  documentation: {
                    nationalID: [],
                    driverLicense: [],
                    passport: [],
                  },
                  _id: "64db85b39e77a4ffc23959da",
                  phoneNumber: "+14088960050",
                  photoOfFace: "1692108209887-Darius%20Golkar.jpg",
                  avatar:
                    "https://commonlands-dev-bucket-aws.s3.us-west-1.amazonaws.com/1692108209887-Darius%2520Golkar.jpg_avatar?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAZBVJQENNESITE3MS%2F20230823%2Fus-west-1%2Fs3%2Faws4_request&X-Amz-Date=20230823T065041Z&X-Amz-Expires=604800&X-Amz-Signature=bc409ae32ddafef898259c211778e1c1750e0d340f6f0794028efcbf3377c472&X-Amz-SignedHeaders=host&x-id=GetObject",
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
              accessToken: {
                type: "string",
              },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: "Return an object include url of pdf file if success",
        content: {
          "application/json": {
            examples: {
              "Create document Successfully": {
                value: {
                  url: "https://raw.githubusercontent.com/dev-fuixlabs/Commonlands_DOC/IMAGE/1692991473198_COMMONLANDS_2-LandCertificate-14088960050-64db86559e77a4ffc2395ada-30.pdf",
                  path: "1692991473198_COMMONLANDS_2-LandCertificate-14088960050-64db86559e77a4ffc2395ada-30.pdf",
                  message: "Create document Successfully",
                },
              },
              "Missing parameters": {
                value: {
                  error_code: 400,
                  error_message: "Bad request. Missing parameters.",
                  detail: "Not found: owner",
                },
              },
              "Document already exists": {
                value: {
                  error_code: 400,
                  error_message: "Bad request. Document already exists.",
                },
              },
              "Cannot get document information": {
                value: {
                  error_code: 400,
                  error_message:
                    "Bad request. Cannot get document information.",
                },
              },
              "Error while creating PDF": {
                value: {
                  error_code: 400,
                  error_message: "Bad request. Error while creating PDF.",
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
                          [31.98189641838985, 1.46410111221806],
                          [31.982118613007515, 1.4639804317163083],
                          [31.982179847744703, 1.463763556594884],
                          [31.982376575336104, 1.4635196171409035],
                          [31.982473607268105, 1.4637163726349343],
                          [31.981983957396352, 1.4641969951430553],
                          [31.98189641838985, 1.46410111221806],
                        ],
                      ],
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
                            coordinates: [
                              [
                                [31.98234437709405, 1.4634632209726135],
                                [31.982375037267257, 1.463521524324699],
                                [31.982179847744703, 1.463763556594884],
                                [31.9821169752085, 1.4639828740821343],
                                [31.981902153285628, 1.464097997425691],
                                [31.98181110302778, 1.4640200251540705],
                                [31.982170078860577, 1.463646562551176],
                                [31.98234437709405, 1.4634632209726135],
                              ],
                            ],
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
              },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: "Return an array include credential'hashes if success",
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
                  error_message: "Bad request. Missing parameters.",
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
                          [31.98189641838985, 1.46410111221806],
                          [31.982118613007515, 1.4639804317163083],
                          [31.982179847744703, 1.463763556594884],
                          [31.982376575336104, 1.4635196171409035],
                          [31.982473607268105, 1.4637163726349343],
                          [31.981983957396352, 1.4641969951430553],
                          [31.98189641838985, 1.46410111221806],
                        ],
                      ],
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
                            coordinates: [
                              [
                                [31.98234437709405, 1.4634632209726135],
                                [31.982375037267257, 1.463521524324699],
                                [31.982179847744703, 1.463763556594884],
                                [31.9821169752085, 1.4639828740821343],
                                [31.981902153285628, 1.464097997425691],
                                [31.98181110302778, 1.4640200251540705],
                                [31.982170078860577, 1.463646562551176],
                                [31.98234437709405, 1.4634632209726135],
                              ],
                            ],
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
                  photoOfFace: "1692108209887-Darius%20Golkar.jpg",
                  avatar:
                    "https://commonlands-dev-bucket-aws.s3.us-west-1.amazonaws.com/1692108209887-Darius%2520Golkar.jpg_avatar?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAZBVJQENNESITE3MS%2F20230823%2Fus-west-1%2Fs3%2Faws4_request&X-Amz-Date=20230823T065041Z&X-Amz-Expires=604800&X-Amz-Signature=bc409ae32ddafef898259c211778e1c1750e0d340f6f0794028efcbf3377c472&X-Amz-SignedHeaders=host&x-id=GetObject",
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
                  error_message: "Bad request. Missing parameters.",
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
        description: "Return an object include revoked is true if success",
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
                  error_message: "Bad request. Missing parameters.",
                  detail: "Not found: owner",
                },
              },
              "Revoke document failed": {
                value: {
                  error_code: 400,
                  error_message: "Bad request. Revoke document failed.",
                },
              },
            },
          },
        },
      },
    },
  },
};

export const multipleCommonlandsDocumentSigning = {
  post: {
    tags: ["Commonlands Document"],
    summary: "Multiple sign a Land Certificate for the Commonlands Project",
    requestBody: {
      require: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              content: {
                type: "object",
                example: {},
              },
              claimants: {
                type: "array",
                example: [],
              },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: "Return an object include url of pdf file if success",
        content: {
          "application/json": {
            examples: {
              "Multiple sign successfully": {
                value: {
                  url: "https://raw.githubusercontent.com/dev-fuixlabs/Commonlands_DOC/IMAGE/1692991473198_COMMONLANDS_2-LandCertificate-14088960050-64db86559e77a4ffc2395ada-30.pdf",
                  path: "1692991473198_COMMONLANDS_2-LandCertificate-14088960050-64db86559e77a4ffc2395ada-30.pdf",
                  message: "Multiple sign successfully",
                },
              },
              "Missing parameters": {
                value: {
                  error_code: 400,
                  error_message: "Bad request. Missing parameters.",
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

export const commonlandsCredential = {
  post: {
    tags: ["Commonlands Credential"],
    summary: "Create a credential for the Commonlands Project",
    requestBody: {
      require: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              metadata: {
                type: "object",
                example: {
                  name: "Land Certificate",
                  description: "Land Certificate for the Commonlands Project",
                },
              },
              config: {
                type: "object",
                example: {
                  contractAddress: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
                  contractName: "Commonlands",
                  contractType: "ERC721",
                  contractSymbol: "CLNDS",
                },
              },
              did: {
                type: "string",
                example:
                  "did:cardano:addr_test1qzj2pgqct6jwpvw7mjtjtess4nlmu385hzarszh9jxcv9eudvd5vt62wt4n97tqqcr43qs7d0v2eex2rkn763zzkys2swwrcxw",
              },
              subject: {
                type: "object",
                example: {
                  address: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
                  subject: {
                    object: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
                    action: {
                      code: 1,
                    },
                  },
                },
              },
              signData: {
                type: "object",
                example: {
                  key: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
                  signature: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
                },
              },
              issuerKey: {
                type: "string",
                example: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
              },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: "Return an object include url of pdf file if success",
        content: {
          "application/json": {
            examples: {
              "Create credential successfully": {
                value: {
                  message: "Successfully Saved",
                },
              },
              "Missing parameters": {
                value: {
                  error_code: 400,
                  error_message: "Bad request. Missing parameters.",
                },
              },
            },
          },
        },
      },
    },
  },
};

export const commonlandsPdf = {
  post: {
    tags: ["Commonlands PDF"],
    summary:
      "Hash the content of the PDF document along with the provided name, the hash of the wrapped document, and the associated DID document. Afterwards, store this combined data in an S3 bucket.",
    requestBody: {
      require: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              pdfName: {
                type: "string",
                example:
                  "1692991473198_COMMONLANDS_2-LandCertificate-14088960050",
              },
              targetHash: {
                type: "string",
                example:
                  "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z",
              },
              did: {
                type: "string",
                example:
                  "did:cardano:addr_test1qzj2pgqct6jwpvw7mjtjtess4nlmu385hzarszh9jxcv9eudvd5vt62wt4n97tqqcr43qs7d0v2eex2rkn763zzkys2swwrcxw",
              },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: "Return an object include hash of pdf file if success",
        content: {
          "application/json": {
            examples: {
              "Save PDF file successfully ": {
                value: {
                  hash: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z",
                },
              },
              "Missing parameters": {
                value: {
                  error_code: 400,
                  error_message: "Bad request. Missing parameters.",
                  detail: "Not found: owner",
                },
              },
            },
          },
        },
      },
    },
  },
  get: {
    tags: ["Commonlands PDF"],
    summary: "Get a PDF file from a hash",
    description: "",
    operationId: "getPdf",
    parameters: [
      {
        name: "did",
        in: "path",
        description: "did of the pdf file",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
    responses: {
      200: {
        description: "Return a PDF file if success",
        content: {
          "application/json": {
            examples: {
              "Get PDF file successfully": {
                value: {
                  url: "https://raw.githubusercontent.com/dev-fuixlabs/Commonlands_DOC/IMAGE/1695204643781_TESTING_COMMONLANDS-LandCertificate-14088960050-64db86559e77a4ffc2395ada_103.pdf",
                },
              },
              "Missing parameters": {
                value: {
                  error_code: 400,
                  error_message: "Bad request. Missing parameters.",
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
                  error_message: "Cannot get document information",
                },
              },
            },
          },
        },
      },
    },
  },
};

export const verifyCommonlandsPdf = {
  post: {
    tags: ["Commonlands PDF"],
    summary:
      "Verify the existence of the provided URL and subsequently validate the PDF obtained from that URL.",
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
        description: "Return an object include isValid is true if success",
        content: {
          "application/json": {
            examples: {
              "Verify PDF file successfully": {
                value: {
                  isValid: true,
                },
              },
              "Missing parameters": {
                value: {
                  error_code: 400,
                  error_message: "Bad request. Missing parameters.",
                },
              },
              "This PDF file is not valid!": {
                value: {
                  error_code: 400,
                  error_message: "This PDF file is not valid!",
                },
              },
            },
          },
        },
      },
    },
  },
};

export const verifyCommonlandsPdfV2 = {
  post: {
    tags: ["Commonlands PDF"],
    summary:
      "Verify the existence of the provided URL and subsequently validate the PDF obtained from that URL version 2.",
  },
};

export const verifyUploadedCommonlandsPdf = {
  post: {
    tags: ["Commonlands PDF"],
    summary: "",
    requestBody: {
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            properties: {
              file: {
                type: "string",
                format: "binary",
              },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: "Return an object include isValid is true if success",
        content: {
          "application/json": {
            examples: {
              "Verify PDF file successfully": {
                value: {
                  isValid: true,
                },
              },
              "This PDF file is not valid!": {
                value: {
                  error_code: 400,
                  error_message: "This PDF file is not valid!",
                },
              },
              "Missing parameters": {
                value: {
                  error_code: 400,
                  error_message: "Missing file.",
                },
              },
            },
          },
        },
      },
    },
  },
};

export const blockDocument = {
  post: {
    tags: ["Commonlands Document"],
    summary: "Block a Commonlands Document",
    description: "",
    operationId: "blockDocument",
    requestBody: {
      require: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              did: {
                type: "string",
                example: "did:fuixlabs:COMMONLANDS_2:Contract-sample_id_11",
              },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: "Return a object include status of block contract",
        content: {
          "application/json": {
            examples: {
              "Block document success": {
                value: {
                  message:
                    "Block document did:fuixlabs:COMMONLANDS_2:Contract-sample_id_11 successfully",
                },
              },
              "Missing parameters": {
                value: {
                  error_code: 400,
                  message: "Missing parameters",
                  detail: "Not found: did",
                },
              },
              "Invalid DID": {
                value: {
                  error_code: 400,
                  message: "Invalid DID",
                },
              },
              "Cannot get document information": {
                value: {
                  error_code: 400,
                  message: "Cannot get document information",
                },
              },
            },
          },
        },
      },
    },
  },
};

export const checkDocumentBlockStatus = {
  post: {
    tags: ["Commonlands Document"],
    summary: "Check status of block document",
    description: "",
    operationId: "checkBlockStatus",
    requestBody: {
      require: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              did: {
                type: "string",
                example: "did:fuixlabs:COMMONLANDS_2:Contract-sample_id_11",
              },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: "Return a object include status of block document",
        content: {
          "application/json": {
            examples: {
              "Document is blocked": {
                value: {
                  isBlocked: true,
                },
              },
              "Document is not blocked": {
                value: {
                  isBlocked: false,
                },
              },
              "Missing parameters": {
                value: {
                  error_code: 400,
                  message: "Missing parameters",
                  detail: "Not found: did",
                },
              },
              "Invalid DID": {
                value: {
                  error_code: 400,
                  message: "Invalid DID",
                },
              },
              "Cannot get document information": {
                value: {
                  error_code: 400,
                  message: "Cannot get document information",
                },
              },
            },
          },
        },
      },
    },
  },
};
