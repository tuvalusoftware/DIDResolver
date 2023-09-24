import { ERRORS } from "../../constants.js";

export const getEndorsementChainOfCertificate = {
  get: {
    tags: ["Commonlands Document"],
    summary: "Get endorsement chain of certificate",
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
        description: "Return an array include endorsement chain if success",
        content: {
          "application/json": {
            examples: {
              "Get endorsement chain successfully": {
                value: [
                  {
                    profileImage:
                      "604a813a-fb29-4ea9-9638-23f62fc6952c:string:sampleProfileImage",
                    fileName:
                      "1da07b03-3781-4e69-9b30-d39e1e2fcd16:string:PlotCertification-64db86559e77a4ffc2395ada_40",
                    name: "e5aceefc-923f-4604-9946-9687cc6ea258:string:Land Certificate",
                    title:
                      "556de968-e304-44b9-8b42-3fa5d4e69ef4:string:Land-Certificate-VNZ-739",
                    No: "23e54e44-a94b-425f-850f-2c09950a2f77:string:b40f4b1",
                    dateIssue:
                      "3a597d8c-8328-4632-8bea-e7dc02a7bf6c:string:2023-09-22 10:43:53",
                    plotInformation: {
                      plotName:
                        "f1f8a5d6-b7fa-483e-99fd-268105c29758:string:VNZ-739",
                      plotId:
                        "f85e3fcb-50f6-4313-b757-fcf238c6e8c9:string:64e824749a9c9e91c27c8b12",
                      plot_Id:
                        "74652a12-fa1f-419c-b8d3-11cc121b3591:string:64db86559e77a4ffc2395ada_40",
                      plotStatus:
                        "a3bad461-fce6-49f4-8f9a-f3dd3a25594f:string:F&C",
                      plotPeople:
                        "e970e910-99f1-4beb-a26b-27af5f0be207:string:Verified by 3 claimants, 6 Neighbors",
                      plotLocation:
                        "b5c1e77f-0bc5-4454-8143-0b831d11ccdb:string:Nakasongola, Uganda",
                      plotCoordinates:
                        "db7d5deb-8153-4745-ab91-9dcb0854c3a1:string:31.98217150319044,1.4638796809080243",
                      plotNeighbors:
                        "7ec75711-4339-4110-b486-5c18e92df399:number:0",
                      plotClaimants:
                        "5d90a5dd-1a6b-4892-bf30-6876c4a85cb5:number:0",
                      plotDisputes:
                        "82924605-db8e-4415-952a-de5e466cae48:number:0",
                    },
                    certificateByCommonlands: {
                      publicSignature:
                        "f79e3cc2-8e41-4019-a508-51e324c5c573:string:commonlandsSignatureImage",
                      name: "8f3f6deb-324d-4a74-b63a-1e65106439b5:string:Commonlands System LLC",
                      commissionNumber:
                        "1523159e-d6bc-4507-9739-e996fe092798:string:139668234",
                      commissionExpiries:
                        "717d1cb5-6be2-4fe6-acc6-966a4a5bc3da:string:09/12/2030",
                    },
                    certificateByCEO: {
                      publicSignature:
                        "93294cb7-f02f-44fb-8483-2b71f6c47c3d:string:ceoSignature",
                      name: "4c538a44-55c2-4d15-9c6a-80706da4a9ae:string:Darius Golkar",
                      commissionNumber:
                        "8eca2c25-00e4-4fe3-b818-1d9a89621841:string:179668234",
                      commissionExpiries:
                        "41696838-4e53-49a0-badb-8e4f58c925d4:string:09/12/2030",
                    },
                    companyName:
                      "2bfa24d6-cd2a-46a6-aa72-c82b26db519e:string:COMMONLANDS_2",
                    intention:
                      "585b3e66-b69b-42cd-ab08-e0dedaefc048:string:trade",
                    did: "a7067d19-d8d4-4085-8ddc-ade230e994b2:string:did:fuixlabs:COMMONLANDS_2:PlotCertification-64db86559e77a4ffc2395ada_40",
                    issuers: [
                      {
                        identityProofType: {
                          type: "d0638294-eb26-4b95-9778-b088f000bfeb:string:DID",
                          did: "06332bab-07da-40c4-a3f5-d914f3ad5354:string:did:fuixlabs:COMMONLANDS_2:00f6eeddadb8e07074d189629b43df0dd913c3d3087e7f00ccf58f98f149abe31f60b335bae8ca10853ab35cc2ee332c850dee261af01bc287",
                        },
                        address:
                          "659c67b6-eab9-4ee0-b1c4-3b409622492f:string:00f6eeddadb8e07074d189629b43df0dd913c3d3087e7f00ccf58f98f149abe31f60b335bae8ca10853ab35cc2ee332c850dee261af01bc287",
                      },
                    ],
                  },
                  {
                    profileImage:
                      "1536b8d9-c0b9-4595-be63-ec7f58a8c3d9:string:sampleProfileImage",
                    fileName:
                      "4ee78d1b-4768-483b-9120-6cea4e6a08c6:string:PlotCertification-64db86559e77a4ffc2395ada_41",
                    name: "e0b8ce35-66b6-45f0-882c-f32a83e93be9:string:Land Certificate",
                    title:
                      "9f6f6e3a-5381-44db-83ad-3ce665e222b0:string:Land-Certificate-VNZ-739",
                    No: "b7baa905-90ea-4f60-9cee-e9b201b23832:string:b0aeb3a",
                    dateIssue:
                      "f89ff11f-2a8d-4f65-8fb5-cccb308eb2a8:string:2023-09-22 10:46:21",
                    plotInformation: {
                      plotName:
                        "2570ed5d-7243-4744-bd43-a8f062fe3ba3:string:VNZ-739",
                      plotId:
                        "ab8de41b-d395-4aac-8fd9-f5091b2d815c:string:64e824749a9c9e91c27c8b12",
                      plot_Id:
                        "dafc7fe7-886a-4dd2-b4da-3396743c7f03:string:64db86559e77a4ffc2395ada_41",
                      plotStatus:
                        "453c707d-c6fe-499d-b994-8799ad087cb9:string:F&C",
                      plotPeople:
                        "75df9445-f3c7-4061-9da7-135b2f8d5a30:string:Verified by 3 claimants, 6 Neighbors",
                      plotLocation:
                        "dc0b8f70-0f7e-454c-a34e-c6a35d59d32e:string:Nakasongola, Uganda",
                      plotCoordinates:
                        "d60c4308-0dcb-40ac-9586-ee1ae9e9f25f:string:31.98217150319044,1.4638796809080243",
                      plotNeighbors:
                        "eaface8c-744a-4285-ac1e-96d10e80e20f:number:0",
                      plotClaimants:
                        "e6d94c29-42d8-4d8d-86c8-6cf2e9ee5737:number:0",
                      plotDisputes:
                        "d4a89cc7-6d39-4fa7-8404-7d53b5830d45:number:0",
                    },
                    certificateByCommonlands: {
                      publicSignature:
                        "96597b5e-7e57-4f77-9709-4fa1faa883ed:string:commonlandsSignatureImage",
                      name: "fa0d7338-f588-40d2-a49c-f455a02eb5f8:string:Commonlands System LLC",
                      commissionNumber:
                        "0850c285-550d-4415-b398-e42cb3bd4032:string:139668234",
                      commissionExpiries:
                        "046347c1-ba56-42e5-bb0a-2b808c1306a8:string:09/12/2030",
                    },
                    certificateByCEO: {
                      publicSignature:
                        "27cc3eb3-7568-47f2-a951-88bf96d3669c:string:ceoSignature",
                      name: "4ce846c7-f8ac-47a8-b142-d10a29811452:string:Darius Golkar",
                      commissionNumber:
                        "d39b8d24-009e-46bf-b02c-6ad9f9632f18:string:179668234",
                      commissionExpiries:
                        "f88e47f7-a605-4c9c-867f-437058de2cb2:string:09/12/2030",
                    },
                    companyName:
                      "77a6135c-b15a-43b9-99f8-eb9e1d2fe6cd:string:COMMONLANDS_2",
                    intention:
                      "9b3e77d5-b7e9-4737-83ab-6ef299a7d46f:string:trade",
                    did: "2580326a-71ec-45f3-8a83-195e594a3562:string:did:fuixlabs:COMMONLANDS_2:PlotCertification-64db86559e77a4ffc2395ada_41",
                    issuers: [
                      {
                        identityProofType: {
                          type: "4a9e18de-5093-4bc7-9aa0-0475f7716ef6:string:DID",
                          did: "3e6d8ed7-93bc-4526-a351-83329c8ff5f7:string:did:fuixlabs:COMMONLANDS_2:00f6eeddadb8e07074d189629b43df0dd913c3d3087e7f00ccf58f98f149abe31f60b335bae8ca10853ab35cc2ee332c850dee261af01bc287",
                        },
                        address:
                          "d2226a95-8d21-4b50-90c8-96c3437e51c4:string:00f6eeddadb8e07074d189629b43df0dd913c3d3087e7f00ccf58f98f149abe31f60b335bae8ca10853ab35cc2ee332c850dee261af01bc287",
                      },
                    ],
                  },
                ],
              },
              "Missing parameters": {
                value: {
                  ...ERRORS.MISSING_PARAMETERS,
                  detail: "Not found: did",
                },
              },
              "Cannot found document": {
                value: ERRORS.CANNOT_FOUND_DID_DOCUMENT,
              },
              "Cannot get document information": {
                value: ERRORS.CANNOT_GET_DOCUMENT_INFORMATION,
              },
            },
          },
        },
      },
    },
  },
};

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
  put: {
    tags: ["Commonlands Document"],
    summary:
      "Update a Plot Certificate for the Commonlands Project. This function serves as a wrapper for the DID Document",
    requestBody: {
      require: true,
    },
    responses: {
      200: {
        description: "Return an array include credential'hashes if success",
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

export const checkLastestVersion = {
  post: {
    tags: ["Commonlands Document"],
    summary: "Check lastest version of document",
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
              hash: {
                type: "string",
                example:
                  "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z",
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
              "Document is lastest version": {
                value: {
                  valid: true,
                  verifier_message:
                    "This is the latest version of the document",
                },
              },
              "Document is not lastest version": {
                value: {
                  valid: false,
                  verifier_message:
                    "This is the latest version of the document",
                },
              },
              "Missing parameters": {
                value: {
                  ...ERRORS.MISSING_PARAMETERS,
                  detail: "Not found: did",
                },
              },
              "Invalid DID": {
                value: ERRORS.INVALID_DID,
              },
              "Cannot get document information": {
                value: ERRORS.CANNOT_FOUND_DID_DOCUMENT,
              },
            },
          },
        },
      },
    },
  },
};

export const verifyCertificateQrcode = {
  get: {
    tags: ["Commonlands Document"],
    summary: "Verify a certificate by QR code",
    description: "",
    operationId: "verifyCertificateQrcode",
    parameters: [
      {
        name: "did",
        in: "query",
        description: "did of the certificate",
        required: true,
        schema: {
          type: "string",
        },
      },
      {
        name: "hash",
        in: "query",
        description: "hash of the certificate",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
    responses: {
      200: {
        description: "Return a object include status of block document",
        content: {
          "application/json": {
            examples: {
              "Certificate is valid": {
                value: {
                  success: true,
                  success_message: "Document is valid",
                  isValid: true,
                },
              },
              "Certificate is invalid": {
                value: {
                  ...ERRORS.CERTIFICATE_IS_NOT_VALID,
                  detail: "This is not the latest version of the document;",
                },
              },
              "Missing parameters": {
                value: {
                  ...ERRORS.MISSING_PARAMETERS,
                  detail: "Not found: did",
                },
              },
              "Invalid DID": {
                value: ERRORS.INVALID_DID,
              },
            },
          },
        },
      },
    },
  },
};
