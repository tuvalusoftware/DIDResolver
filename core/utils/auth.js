import "dotenv/config";

// * Utilities
import axios from "axios";
import { getAccountBySeedPhrase, signData } from "../utils/lucid.js";

// * Constants
import { SERVERS } from "../constants.js";
import jwt_decode from "jwt-decode";
import { getPublicKeyFromAddress } from "../../core/index.js";

const getDappInfo = async () => {
  try {
    const dappKey = process.env.DAPP_KEY;
    const dappInfoRequest = await axios.get(
      `${SERVERS.AUTHENTICATION_SERVICE}/api/app?app-key=${dappKey}`
    );
    if (!dappInfoRequest?.data) throw new Error("Dapp info not found");
    return dappInfoRequest?.data?.data;
  } catch (e) {
    throw e;
  }
};

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
    if (loginResponse?.data?.error_code) {
      throw loginResponse?.data;
    }
    return loginResponse?.data?.data?.access_token;
  } catch (e) {
    throw e;
  }
};

const getRandomNumberEncryption = async () => {
  try {
    const randomNumberResponse = await axios.get(
      `${SERVERS.AUTHENTICATION_SERVICE}/api/auth/getRandomNumber`
    );
    if (!randomNumberResponse?.data)
      throw new Error("Error while getting random number from server");
    return randomNumberResponse?.data?.data;
  } catch (e) {
    throw e;
  }
};

const authenticationProgress = async () => {
  try {
    const randomNumberEncryption = await getRandomNumberEncryption();
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
