const axios = require("axios").default;
const Logger = require("../../logger");
const { ERRORS, SERVERS } = require("../../core/constants");
const { getPublicKeyFromAddress } = require("../../core/index");

/* c8 ignore start */
module.exports = {
    ensureAuthenticated: (req, res, next) => {
        // Ignore auth service in test environment
        if (process.env.NODE_ENV === "test") return next();

        if (!req.cookies["access_token"]) {
            Logger.apiError(req, res, `Not found: access_token.`);
            return res.status(401).json(ERRORS.UNAUTHORIZED);
        }
        const token = req.cookies["access_token"];

        // Call Auth Service
        // success:
        //   { data: { address: string } }
        // error: 401 - unauthorized
        axios
            .get(`${SERVERS.AUTHENTICATION_SERVICE}/api/auth/verify`, {
                withCredentials: true,
                headers: {
                    Cookie: `access_token=${token};`,
                },
            })
            .then(
                (response) => {
                    Logger.apiInfo(req, res, `Successful authentication.`);
                    var response = response.data;
                    req.userData = {
                        token,
                        address: response.address,
                    };

                    next();
                },
                (error) => {
                    Logger.apiError(req, res, `${JSON.stringify(error)}`);
                    return res.status(403).json(ERRORS.PERMISSION_DENIED);
                }
            );
    },

    requestGetPublicKeyFromAddress: (req, res) => {
        const { address, user, confirmNominate } = req.query;

        try {
            const returnKey = getPublicKeyFromAddress(address);
            return res.status(200).json({
                publicKey: returnKey,
                user: user,
            });
        } catch (error) {
            if (error.includes("missing") || error.includes("invalid length")) {
                return res.status(200).json(ERRORS.INVALID_ADDRESS);
            }
            return res.status(400).json(error);
        }
    },

    verifyToken: async (req, res) => {
        if (!req.cookies["access_token"])
            return res.status(401).json(ERRORS.UNAUTHORIZED);
        const token = req.cookies["access_token"];

        try {
            const { data } = await axios.get(
                `${SERVERS.AUTHENTICATION_SERVICE}/api/auth/verify`,
                {
                    withCredentials: true,
                    headers: {
                        Cookie: `access_token=${token};`,
                    },
                }
            );

            return res.status(200).json({
                address: (data?.data?.address),
            });
        } catch (error) {
            Logger.apiError(req, res, `${JSON.stringify(error)}`);
            return error.response
                ? res.status(400).json(error.response.data)
                : res.status(400).json(error);
        }
    },
};
/* c8 ignore stop */
