import { apiError } from "../../../logger.js";
import { ERRORS } from "../../../core/constants.js";
import { checkUndefinedVar } from "../../../core/index.js";
import { getCurrentAccount } from "../../../core/index.js";
import { Lucid } from "lucid-cardano";

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
      const currentWallet = getCurrentAccount({
        mnemonic: seedPhrase,
      });
      const lucid = await Lucid.new(null, "Preprod");
      lucid.selectWalletFromPrivateKey(
        getCurrentAccount({
          mnemonic: seedPhrase,
        }).paymentKey.to_bech32()
      );
      const signMessage = await lucid
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
