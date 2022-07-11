module.exports = {
  type: "object",
  required: ["receiver", "sender", "content", "status"],
  properties: {
    receiver: {
      type: "string",
      description: "DID of receiver",
    },
    sender: {
      type: "string",
      description: "DID of sender",
    },
    content: {
      type: "string",
      description: "Notification information",
    },
    status: {
      type: "object",
      description:
        "Status of the notifincation, which is one of [unread, approve, reject]",
      properties: {
        code: { type: "integer" },
        value: { type: "string" },
      },
    },
  },
  example: {
    receiver: "did:method:companyName:publicKey",
    sender: "did:method:companyName:publicKey",
    content: "Hi! I invite you to be the new owner of the document ABC.",
    status: {
      code: 0,
      value: "unread",
    },
  },
};
