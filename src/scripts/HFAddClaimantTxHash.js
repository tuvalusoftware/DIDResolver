import { RedisService } from "../services/RedisService";

async function HFAddClaimantTxHash() {
    const txHash = await RedisService().getCacheValue(``)
    console.log(`txHash: ${txHash}`);
}

(async () => {
    try {
        await HFAddClaimantTxHash();
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})();
