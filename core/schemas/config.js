module.exports.defaultConfig = {
  type: "object",
  properties: {
    type: { type: "string" },
    asset: { type: "string" },
    policy: { type: "object" },
  },
  example: {
    type: "credential",
    policy: {
      type: "Native",
      id: "ed9f068881fd29842e8b5267ae8220aca2c2953617ce07c7895cfd30",
      script:
        "8201828200581cd37dfe9485c993853d7ac3ea61145315c66bc3a79bc3ad2069a5aa2882051abfce4cf9",
      ttl: 3217968377,
      reuse: true,
    },
    asset:
      "ed9f068881fd29842e8b5267ae8220aca2c2953617ce07c7895cfd30127148bdcb294e220f0c9aef41a307be8e910157901d2bf349492e7919708208",
  },
};

module.exports.algorandConfig = {
  type: 'object',
  properties: {
    txId: {type: 'string'},
    assetId: {type: 'number'},
    assetName: {type: 'string'},
    unitName: {type: 'string'},
    assetURL: {type: 'string'},
    type: {type: 'string'},
    root: {type: 'string'}
  },
  example: {
    "txId": "7XXY4VEBA7XLH6WKEHORVKFLBXQ6N4Z5DYINS6CHAUA6IXWNFJZQ",
    "assetId": 150575850,
    "assetName": "4ebdf92e6b09182efa3a032a73565173",
    "unitName": "9b1e1d68",
    "assetURL": "5bd5b03e1566ed870de95612d657763cd687897d61a32bd8e52e454a7640b131",
    "type": "document",
    "root": "f75bd6e59e46f17ebf7c9beb6636c9f6edcdcc49cccb09f8a0dfd02a577b6d28"
  }
}