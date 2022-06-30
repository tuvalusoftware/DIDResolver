module.exports = {
  type: "object",
  properties: {
    controller: {
      type: "array",
      description: "???",
      items: { type: "string" },
    },
    did: {
      type: "string",
      description: "DID of..."
    },
    owner: {
      type: "string",
      description: "Owner public key.",
    },
    holder: {
      type: "string",
      description: "Holder public key.",
    },
    ulr: {
      type: "string",
      description: "???",
      example: "document_name.document"
    }
  },
  example: {
    controller: ["owner_public_key", "holder_public_key"],
    did: "did:method:companyName:somthing",
    owner: "owner_public_key",
    holder: "holder_public_key",
    url: "document_name.document"
  }
}

// ---
//   controller: b3ls1korgn
// did: did: some_string: Kukulu: b3ls1korgn
// docController: b3ls1korgn
// url: file_name.document

// "didDoc": {
//   "controller": [
//     "owner_public_key",
//     "holder_public_key"
//   ],
//   "did": "did:<company_name>:<owner_pk>:<holder_pk>",
//   "owner": "holder_public_key",
//   "holder": "owner_public_key",
//   "url": "document_name.document"
// }