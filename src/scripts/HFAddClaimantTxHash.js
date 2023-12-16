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
    const vcs = await VerifiableCredentialModel.find({
        txHash: ''
    });
    console.log(`There are ${vcs.length} VCs need to add transaction hash!`)
    if(vcs.length === 0) {
        return;
    }
    const promises = vcs.map(async (vc) => {
        const id = vc.id;
        const vcHash = id.split(':')[3];
        const _txHash = await RedisService().getCacheValue(
             vcHash
        );
        const config = _txHash.data;
        const { assetName, txHash } = config;
        console.log(`vcHash: ${vcHash}, assetName: ${assetName}, txHash: ${txHash}`)
        const _vc = await VerifiableCredentialModel.findOneAndUpdate(
            { _id: vc._id },
            { txHash },
            { new: true }
        );
    });
    await Promise.all(promises).then(() => {
        console.log(`Add transaction hash successfully!`)
    }).catch((error) => {
        console.log(`Error: ${JSON.stringify(error, null, 2)}`)
    })
}

(async () => {
    try {
        await connectToDB();
        await HFAddSpecificClaimantTxHash();
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})();
