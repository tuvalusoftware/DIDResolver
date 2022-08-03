const mintingNFTConfig = require("./config");

module.exports = {
  type: "object",
  required: ["issuer", "credentialSubject", "signature"],
  properties: {
    issuer: {
      type: "string",
      description: "DID of who issues this credential.",
    },
    credentialSubject: {
      type: "object",
      description: "Claims",
      // required: ["object", "action"],
      properties: {
        object: {
          type: "string",
          description: "DID of wrapped document.",
        },
        newOwner: {
          type: "string",
          description: "DID of the new owner who can access the document.",
        },
        newHolder: {
          type: "string",
          description: "DID of the new holder who can access the document.",
        },
        action: {
          type: "object",
          description: "Define the action subject can do with the document.",
          properties: {
            code: { type: "integer" },
            value: { type: "string" },
            label: { type: "string" },
          },
        },
      },
    },
    signature: {
      type: "object",
      description: "Signature of issuer.",
      properties: {
        signature: { type: "string" },
        key: { type: "string" },
      },
    },
    metadata: {
      type: "object",
      description: "Other data when create credential.",
      properties: {
        dateCreated: { type: "string" },
        currentOwner: { type: "string" },
      },
    },
    timestamp: { type: "number" },
    status: { type: "string" },
    mintingNFTConfig: {
      // type: "object",
      // description: "Config of the credential, in other to create a new one.",
      // properties: {
      //   type: { type: "string" },
      //   asset: { type: "string" },
      //   policy: { type: "object" },
      // },
      ...(({ example, ...props }) => props)(mintingNFTConfig),
    },
  },
  example: {
    issuer:
      "did:fuixlabs:PAPERLESS_COMPANY:00d8d294e008e0e2ed6167d8a6c47b421a76604d8d2662ec05195727818f206aa6c6fd2a55810995ee86e2a3b7862f5029ec8d7b988214aae7",
    credentialSubject: {
      object: "did:fuixlabs:PAPERLESS_COMPANY:cover-letter test1",
      action: {
        code: 20,
        value: "nominateChangeOwnership",
        label: "Request transfer of Owner",
        subTitle: "Owner can transfer the OwnerShip.",
        formLabel: "New Owner Address",
        buttonLabel: "Transfer",
        fields: [
          {
            name: "newOwner",
            require: true,
            value: "ownerKey",
          },
        ],
        updatedFieds: [
          {
            name: "ownerKey",
          },
        ],
        surrender: false,
      },
    },
    signature: {
      signature:
        "845846a201276761646472657373583900d8d294e008e0e2ed6167d8a6c47b421a76604d8d2662ec05195727818f206aa6c6fd2a55810995ee86e2a3b7862f5029ec8d7b988214aae7a166686173686564f45902047b2261646472657373223a22303064386432393465303038653065326564363136376438613663343762343231613736363034643864323636326563303531393537323738313866323036616136633666643261353538313039393565653836653261336237383632663530323965633864376239383832313461616537222c227375626a656374223a7b226f626a656374223a226469643a667569786c6162733a50415045524c4553535f434f4d50414e593a636f7665722d6c6574746572207465737431222c22616374696f6e223a7b22636f6465223a32302c2276616c7565223a226e6f6d696e6174654368616e67654f776e657273686970222c226c6162656c223a2252657175657374207472616e73666572206f66204f776e6572222c227375625469746c65223a224f776e65722063616e207472616e7366657220746865204f776e6572536869702e222c22666f726d4c6162656c223a224e6577204f776e65722041646472657373222c22627574746f6e4c6162656c223a225472616e73666572222c226669656c6473223a5b7b226e616d65223a226e65774f776e6572222c2272657175697265223a747275652c2276616c7565223a226f776e65724b6579227d5d2c22757064617465644669656473223a5b7b226e616d65223a226f776e65724b6579227d5d2c2273757272656e646572223a66616c73657d7d7d5840003a9fd1ebeb1f8ba4d404b7e16f7cb89564f0b4648b63038d73aa7a6c03e8fa7abdd7c9865a09a274c9543be3c0e4819f31d577e34c757c0a626e882d19c408",
      key: "a4010103272006215820ced5e982daf60b191fb41fcbfe75453307c644cfdd17b0b81da4792d225dc50a",
    },
    metadata: {
      currentOwner:
        "00d8d294e008e0e2ed6167d8a6c47b421a76604d8d2662ec05195727818f206aa6c6fd2a55810995ee86e2a3b7862f5029ec8d7b988214aae7",
    },
    timestamp: 1659330236137,
    status: "pending",
    mintingNFTConfig: {
      ...mintingNFTConfig.example,
    },
    // issuer: "did:method:Kukulu:zaq12wsxcde34rfvbgt56yhnmju78iko9olp0",
    // credentialSubject: {
    //   object: "did:method:Kukulu:file_name",
    //   newHolder: "did:method:Kukulu:0po9olki87ujmnhy65tgbvfr43edcxsw21qaz",
    //   action: {
    //     code: 2,
    //     value: "changeHoldership",
    //   },
    // },
    // signature: "12345678986543234567qwertytwq231234567876543sdfghgfds",
    // metadata: {
    //   dateCreated: "22-06-2022",
    //   status: "",
    // },
    // mintingNFTConfig: {
    //   ...mintingNFTConfig.example,
    // },
  },
};
