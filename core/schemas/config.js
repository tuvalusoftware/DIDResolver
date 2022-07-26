module.exports = {
  type: "object",
  properties: {
    type: { type: "string" },
    asset: { type: "string" },
    policy: { type: "object" },
  },
  example: {
    type: "credentail",
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
