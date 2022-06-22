module.exports = {
  type: "object",
  required: ["issuer", "subject", "credentialSubject", "signature"],
  properties: {
    issuer: {
      type: "string",
      description: "DID of owner."
    },
    subject: {
      type: "string",
      description: "DID of the new person who can access the document."
    },
    credentialSubject: {
      type: "object",
      description: "???",
      properties: {
        object: {
          type: "string",
          description: "DID of wrapped document."
        },
        action: {
          type: "object",
          description: "Define the action subject can do with the document.",
          properties: {
            code: "integer",
            value: { type: "string" }
          }
        }
      }
    },
    signature: {
      type: "string",
      description: "Signature of issuer."
    },
    metadata: {
      type: "object",
      description: "Other data when create credential.",
      properties: {
        dateCreated: { type: "string" }
      }
    }
  },
  example: {
    credential: {
      issuer: "did:method:Kukulu:zaq12wsxcde34rfvbgt56yhnmju78iko9olp0",
      subject: "did:method:Kukulu:0po9olki87ujmnhy65tgbvfr43edcxsw21qaz",
      credentialSubject: {
        object: "did:method:Kukulu:file_name",
        action: {
          code: 3000,
          value: "changeHoldership"
        }
      },
      signature: "12345678986543234567qwertytwq231234567876543sdfghgfds",
      metadata: {
        dateCreated: "22-06-2022",
      }
    }
  }
}