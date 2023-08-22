import { apiError } from "../../../logger.js";
import { ERRORS } from "../../../core/constants.js";
import { checkUndefinedVar } from "../../../core/index.js";
import { getAccountBySeedPhrase } from "../../../core/utils/lucid.js";
import 'dotenv/config'

export default {
  signMessageBySeedPhrase: async (req, res) => {
    try {
      const { seedPhrase, message } = req.body;
      const undefinedVar = checkUndefinedVar({ seedPhrase, message });
      if (undefinedVar.undefined)
        return res.status(200).json({
          ...ERRORS.MISSING_PARAMETERS,
          detail: undefinedVar.detail,
        });
      const { currentWallet, lucidClient } = await getAccountBySeedPhrase({
        seedPhrase: process.env.ADMIN_SEED_PHRASE,
      });
      const signMessage = await lucidClient
        ?.newMessage(
          currentWallet?.paymentAddr,
          Buffer.from(message).toString("hex")
        )
        .sign();
      return res.status(200).json(signMessage);
    } catch (error) {
      apiError(req, res, `${JSON.stringify(error?.message || error)}`);
      return error.response
        ? res.status(400).json(error.response.data)
        : res.status(400).json(error);
    }
  },
  accountFromSeedPhrase: async (req, res) => {
    try {
      const { seedPhrase } = req.body;
      const undefinedVar = checkUndefinedVar({ seedPhrase });
      if (undefinedVar.undefined)
        return res.status(200).json({
          ...ERRORS.MISSING_PARAMETERS,
          detail: undefinedVar.detail,
        });
      const currentWallet = getCurrentAccount({
        mnemonic: seedPhrase,
      });
      return res.status(200).json(currentWallet);
    } catch (error) {
      apiError(req, res, `${JSON.stringify(error?.message || error)}`);
      return error.response
        ? res.status(400).json(error.response.data)
        : res.status(400).json(error);
    }
  },
};
