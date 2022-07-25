const axios = require("axios").default;
const { ERRORS, SERVERS } = require("../../core/constants");

module.exports = {
  getNFTs: async function (req, res) {
    console.log('Call')
    // Receive input data
    const { access_token } = req.cookies;
    const { policyid: policyId } = req.headers;
    console.log(1)
    // Handle input errors
    if (!policyId)
      return res.status(200).json({
        ...ERRORS.MISSING_PARAMETERS,
        detail: "Not found: policyid",
      });
      console.log(2)
    // Call Cardano Service
    // success:
    //   {
    //     data: {
    //       nfts: [
    //         {
    //           unit: "199062e26a0ea1370249e71e6224c6541e7825a192fe42c57aa538c341616461476f6c64656e526566657272616c31363339303438343435",
    //           quantity: 1
    //         }
    //       ]
    //     }
    //   }
    // error:
    //   { error_code: number, error_message: string }
    axios
      .post(
        `${SERVERS.CARDANO_SERVICE}/api/v2/fetch/nft`,
        {
          policyId: policyId,
        },
        {
          withCredentials: true,
          headers: {
            Cookie: `access_token=${access_token}`,
          },
        }
      )
      .then((response) => {
        console.log('TUTU', response.data)
        res.status(200).json(response.data)
      })
      .catch((error) => {
        return error.response
          ? res.status(400).json(error.response.data)
          : res.status(400).json(error);
      });
  },

  verifyHash: async function (req, res) {
    // Receive input data
    const { access_token } = req.cookies;
    const { hashofdocument, policyid } = req.headers;
    // Handle input errors
    if (!hashofdocument || !policyid)
      return res.status(200).json({
        ...ERRORS.MISSING_PARAMETERS,
        detail:
          "Not found:" + !hashofdocument
            ? " hashOfDocument"
            : "" + !policyid
            ? " policyId"
            : "",
      });

    // Call Cardano Service
    // succes:
    //   { data: { result: true/false } }
    // error:
    //   { error_code: number, error_message: string }
    console.log('Start')
    axios
      .post(
        `${SERVERS.CARDANO_SERVICE}/api/v2/fetch/nft`,
        {
          asset: `${policyid}${hashofdocument}`,
        },
        {
          withCredentials: true,
          headers: {
            Cookie: `access_token=${access_token}`,
          },
        }
      )
      .then((response) => {
        return res.status(200).json(response.data)
      })
      .catch((error) => {
        console.log(2, error)
        return error.response
          ? res.status(400).json(error.response.data)
          : res.status(400).json(error);
      });
  },

  verifySignature: async function (req, res) {
    // Receive input data
    const { access_token } = req.cookies;
    const { address, payload, signature, key } = req.headers;

    // Handle input error
    if (!address || !payload || !signature)
      return res.status(200).json({
        ...ERRORS.MISSING_PARAMETERS,
        detail:
          "Not found:" + !address
            ? " address"
            : "" + !payload
            ? " payload"
            : "" + !signature
            ? " signature"
            : "",
      });

    // Call Cardano Service
    // success:
    //   { data: { result: true/false } }
    // error:
    //   { error_code: number, error_message: string }
    axios
      .post(
        SERVERS.CARDANO_SERVICE + "/api/v2/verify/signature",
        {
          address: address,
          payload: payload,
          signature: signature,
          key: key,
        },
        {
          withCredentials: true,
          headers: {
            Cookie: `access_token=${access_token}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data)
        res.status(200).json(response.data)
      })
      .catch((error) => {
        console.log('Error')
        return error.response
          ? res.status(400).json(error.response.data)
          : res.status(400).json(error);
      });
  },
};
