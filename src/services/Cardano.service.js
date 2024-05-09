import { env } from "../configs/constants.js";
import { getAccountBySeedPhrase } from "../utils/lucid.js";

const { currentWallet, lucidClient } = await getAccountBySeedPhrase({
    seedPhrase: env.CARDANO_SEED_PHRASE,
});

class CardanoService {
    constructor() {
        this.seedPhrase = env.CARDANO_SEED_PHRASE;
        this.wallet = currentWallet;
        this.client = lucidClient;
    }

    async getPaymentAddress() {
        return currentWallet?.paymentAddr;
    }

    async sign(data) {
        return await this.client
            ?.newMessage(
                getPublicKeyFromAddress(currentWallet?.paymentAddr),
                Buffer.from(JSON.stringify(data)).toString("hex")
            )
            .sign();
    }
}

const cardanoService = new CardanoService();

export default cardanoService;
