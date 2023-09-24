import "dotenv/config";

// * Utilities
import axios from "axios";
import { getAccountBySeedPhrase, signData } from "../utils/lucid.js";

// * Constants
import { SERVERS } from "../../config/constants.js";
import jwt_decode from "jwt-decode";
import { getPublicKeyFromAddress } from "./index.js";

/**
 * Function used for getting authentication token from authentication service
 * @param {String} randomNumber
 * @param {String} timestamp
 * @param {String} signedData
 * @param {String} address
 * @param {String} accessToken
 * @returns {String} - access token
 */
const getAuthenticationToken = async ({
  randomNumber,
  timestamp,
  signedData,
  address,
  accessToken,
}) => {
  try {
    const loginResponse = await axios.post(
      `${SERVERS?.AUTHENTICATION_SERVICE}/api/auth/v2/login?network=Cardano`,
      {
        randomNumber,
        timestamp,
        signedData,
        address,
        network: "Cardano",
      },
      {
        withCredentials: true,
        headers: {
          Cookie: `access_token=${accessToken}`,
        },
      }
    );
    console.log(loginResponse?.data)
    if (loginResponse?.data?.error_code) {
      throw loginResponse?.data;
    }
    return loginResponse?.data?.data?.access_token;
  } catch (e) {
    throw e;
  }
};

/**
 * Function used for getting random number from authentication service
 * @returns {String} - random number
 */
const getRandomNumberEncryption = async () => {
  try {
    console.log(1)
    const randomNumberResponse = await axios.get(
      `${SERVERS.AUTHENTICATION_SERVICE}/api/auth/getRandomNumber`
    );
    console.log(2)
    console.log(randomNumberResponse?.data)
    if (!randomNumberResponse?.data)
      throw new Error("Error while getting random number from server");
    return randomNumberResponse?.data?.data;
  } catch (e) {
    throw e;
  }
};

/**
 * Function used for getting authentication token, this token is used for accessing to other services
 * @returns {String} - access token
 */
const authenticationProgress = async () => {
  try {
    console.log('CAC1')
    const randomNumberEncryption = await getRandomNumberEncryption();
    console.log('CAC2')
    const decodedData = jwt_decode(randomNumberEncryption?.access_token);
    const { randomNumber, timestamp } = decodedData?.data;
    const { currentWallet } = await getAccountBySeedPhrase({
      seedPhrase: process.env.ADMIN_SEED_PHRASE,
    });

    const signMessage = await signData(
      getPublicKeyFromAddress(currentWallet?.paymentAddr),
      Buffer.from(
        JSON.stringify({
          randomNumber,
          timestamp,
        }),
        "utf8"
      ).toString("hex"),
      process?.env?.ADMIN_PASSWORD,
      0
    );
    const accessToken = await getAuthenticationToken({
      randomNumber,
      timestamp,
      signedData: signMessage,
      address: getPublicKeyFromAddress(currentWallet?.paymentAddr),
      accessToken: randomNumberEncryption?.access_token,
    });
    return accessToken;
  } catch (e) {
    throw e;
  }
};

export { authenticationProgress };
