import { env } from "../configs/constants.js";
import * as StellarSdk from "@stellar/stellar-sdk";

class StellarService {
    constructor() {
        this.privateKey = env.STELLAR_PUBLIC_KEY;
    }

    async sign(data) {
        const keypair = StellarSdk.Keypair.fromSecret(this.privateKey);
        return keypair.sign(data);
    }

    async verify(data, signature) {
        const keypair = StellarSdk.Keypair.fromSecret(this.privateKey);
        return keypair.verify(data, signature);
    }

    async getPrivateKey() {
        return this.privateKey;
    }

    async getPublicKey() {
        const keypair = StellarSdk.Keypair.fromSecret(this.privateKey);
        return keypair.publicKey();
    }
}

const stellarService = new StellarService();
export default stellarService;
