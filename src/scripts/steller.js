import StellarSdk from "@stellar/stellar-sdk";

const generateKeysPair = async () => {
    const issuerKeypair = StellarSdk.Keypair.random();
    console.log("secrey-key", issuerKeypair.secret());
    console.log("DONE");
};

(async () => {
    try {
        await generateKeysPair();
    } catch (err) {
        console.log("Default data added unsuccessful.");
        console.log(err);
    } finally {
        console.log("DONE");
    }
})();
