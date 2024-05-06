import { env } from "../configs/constants.js";
import { sign } from "@stellar/stellar-sdk";

class StellarService {
    constructor() {
        this.publicKey = env.STELLAR_PUBLIC_KEY;
    }

    async sign(data) {
        return sign(data, this.publicKey);
    }

    async getPublicKey() {
        return this.publicKey;
    }
}

const stellarService = new StellarService();
export default stellarService;
