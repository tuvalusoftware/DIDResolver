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
