const { getDidDocument } = require("./getDidDocument");
const { postDidDocument } = require("./postDidDocument");

module.exports = {
    'did-document': {
        ...getDidDocument,
        ...postDidDocument,
    }
}