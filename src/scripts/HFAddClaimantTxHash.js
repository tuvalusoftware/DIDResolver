import { RedisService } from "../services/RedisService.js";
import mongoose, { Schema } from "mongoose";

const port = 27010;
const dbName = "controller";
const dbURL = `mongodb://localhost:${port}/${dbName}`;
const MONGO_INITDB_ROOT_PASSWORD = "dominium-PassWord-2023";
const MONGO_INITDB_ROOT_USERNAME = "dominium";

const verifiableCredentialSchema = new Schema({
    id: {
        type: String,
        unique: true,
        required: true,
    },
    "@context": {
        type: [String],
        required: true,
    },
    issuer: {
        type: String,
        required: true,
    },
    credentialSubject: {
        type: Object,
        required: true,
    },
    proof: {
        type: Object,
        required: true,
    },
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    validFrom: {
        type: Date,
    },
    validUntil: {
        type: Date,
    },
    type: {
        type: String,
    },
    txHash: {
        type: String,
    },
});

const VerifiableCredentialModel = mongoose.model(
    "VerifiableCredential",
    verifiableCredentialSchema
);

async function connectToDB() {
    try {
        mongoose
            .connect(dbURL, {
                authSource: "admin",
                user: MONGO_INITDB_ROOT_USERNAME,
                pass: MONGO_INITDB_ROOT_PASSWORD,
            })
            .then(() => {
                console.log(`Connected to ${dbName} database successfully!`);
            })
            .catch((error) => {
                console.log(`Error: ${error}`);
                return process.exit(1);
            });
    } catch (error) {
        console.log(`Error: ${error}`);
    }
}

async function HFAddSpecificClaimantTxHash() {
    // const _txHash = await RedisService().getCacheValue(
    //     `57000d9db9728593932e366521d860d4e2b89e11b0128397527f6f5105e3827a`
    // );
    // const config = _txHash.data;
    // const { assetName, txHash } = config;
    // console.log(`assetName: ${assetName}, txHash: ${txHash}`);
    const vc = await VerifiableCredentialModel.findOne({
        txHash: ''
    });
    console.log(vc);
}

(async () => {
    try {
        await connectToDB();
        // await HFAddSpecificClaimantTxHash();
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})();
