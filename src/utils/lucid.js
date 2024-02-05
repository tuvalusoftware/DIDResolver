import * as BIP39 from "bip39";
import { C as CardanoWasm, M as CardanoMessage } from "lucid-cardano";
import { NETWORK_ID } from "../configs/constants.js";
import { Lucid } from "lucid-cardano";
import cryptoRandomString from "crypto-random-string";
import dotenv from "dotenv";
import { env } from "../configs/constants.js";

dotenv.config();

/**
 * Function used for validating address bytes
 * @param {String} address
 * @returns {Boolean} - true if valid, false otherwise
 */
async function isValidAddressBytes(address) {
    const supportNetworkId = "preprod";
    const network = {
        id: supportNetworkId,
    };
    try {
        const addr = CardanoWasm.Address.from_bytes(address);
        if (
            (addr.network_id() === 1 && network.id === NETWORK_ID.mainnet) ||
            (addr.network_id() === 0 &&
                (network.id === NETWORK_ID.testnet ||
                    network.id === NETWORK_ID.preview ||
                    network.id === NETWORK_ID.preprod))
        )
            return true;
        return false;
    } catch (e) {}
    try {
        const addr = CardanoWasm.ByronAddress.from_bytes(address);
        if (
            (addr.network_id() === 1 && network.id === NETWORK_ID.mainnet) ||
            (addr.network_id() === 0 &&
                (network.id === NETWORK_ID.testnet ||
                    network.id === NETWORK_ID.preview ||
                    network.id === NETWORK_ID.preprod))
        )
            return true;
        return false;
    } catch (e) {}
    return false;
}

async function decryptWithPassword(password, encryptedKeyHex) {
    const passwordHex = Buffer.from(password).toString("hex");
    let decryptedHex;
    try {
        decryptedHex = CardanoWasm.decrypt_with_password(
            passwordHex,
            encryptedKeyHex
        );
    } catch (err) {
        throw new Error("Invalid password");
    }
    return decryptedHex;
}

async function encryptWithPassword(password, rootKeyBytes) {
    const rootKeyHex = Buffer.from(rootKeyBytes, "hex").toString("hex");
    const passwordHex = Buffer.from(password).toString("hex");
    const salt = cryptoRandomString({ length: 2 * 32 });
    const nonce = cryptoRandomString({ length: 2 * 12 });
    return CardanoWasm.encrypt_with_password(
        passwordHex,
        salt,
        nonce,
        rootKeyHex
    );
}

function getStorage(key) {
    return new Promise((res, rej) =>
        chrome.storage.local.get(key, (result) => {
            if (chrome.runtime.lastError) rej(undefined);
            res(key ? result[key] : result);
        })
    );
}

function harden(num) {
    return 0x80000000 + num;
}

async function requestAccountKey(password, accountIndex) {
    const { currentWallet } = await getAccountBySeedPhrase(
        env.ADMIN_SEED_PHRASE
    );
    const encryptedRootKey = await encryptWithPassword(
        password,
        currentWallet?.rootKey.as_bytes()
    );
    let accountKey;
    try {
        accountKey = CardanoWasm.Bip32PrivateKey.from_bytes(
            Buffer.from(
                await decryptWithPassword(password, encryptedRootKey),
                "hex"
            )
        )
            .derive(harden(1852)) // purpose
            .derive(harden(1815)) // coin type;
            .derive(harden(parseInt(accountIndex)));
    } catch (e) {
        throw new Error("Invalid password");
    }

    return {
        accountKey,
        paymentKey: accountKey.derive(0).derive(0).to_raw_key(),
        stakeKey: accountKey.derive(2).derive(0).to_raw_key(),
    };
}

async function extractKeyHash(address) {
    if (!(await isValidAddressBytes(Buffer.from(address, "hex"))))
        throw new Error("Invalid address format");
    try {
        const addr = CardanoWasm.BaseAddress.from_address(
            CardanoWasm.Address.from_bytes(Buffer.from(address, "hex"))
        );
        return addr.payment_cred().to_keyhash().to_bech32("addr_vkh");
    } catch (e) {}
    try {
        const addr = CardanoWasm.EnterpriseAddress.from_address(
            CardanoWasm.Address.from_bytes(Buffer.from(address, "hex"))
        );
        return addr.payment_cred().to_keyhash().to_bech32("addr_vkh");
    } catch (e) {}
    try {
        const addr = CardanoWasm.PointerAddress.from_address(
            CardanoWasm.Address.from_bytes(Buffer.from(address, "hex"))
        );
        return addr.payment_cred().to_keyhash().to_bech32("addr_vkh");
    } catch (e) {}
    try {
        const addr = CardanoWasm.RewardAddress.from_address(
            CardanoWasm.Address.from_bytes(Buffer.from(address, "hex"))
        );
        return addr.payment_cred().to_keyhash().to_bech32("stake_vkh");
    } catch (e) {}
    throw new Error("Invalid address format");
}

function getCurrentAccount({ mnemonic }) {
    const entropy = BIP39.mnemonicToEntropy(mnemonic);
    const rootKey = CardanoWasm.Bip32PrivateKey.from_bip39_entropy(
        Buffer.from(entropy, "hex"),
        Buffer.from("")
    );

    const harden = (num) => {
        return 0x80000000 + num;
    };

    const accountKey = rootKey
        .derive(harden(1852))
        .derive(harden(1815))
        .derive(harden(0));
    const paymentKey = accountKey.derive(0).derive(0).to_raw_key();
    const stakeKey = accountKey.derive(2).derive(0).to_raw_key();

    const paymentKeyPub = paymentKey.to_public();
    const stakeKeyPub = stakeKey.to_public();

    const paymentKeyHash = Buffer.from(
        paymentKeyPub.hash().to_bytes(),
        "hex"
    ).toString("hex");

    // Base address with Staking Key
    const paymentAddr = CardanoWasm.BaseAddress.new(
        env.CARDANO_NETWORK !== 1
            ? CardanoWasm.NetworkInfo.testnet().network_id()
            : CardanoWasm.NetworkInfo.mainnet().network_id(),
        CardanoWasm.StakeCredential.from_keyhash(paymentKeyPub.hash()),
        CardanoWasm.StakeCredential.from_keyhash(stakeKeyPub.hash())
    )
        .to_address()
        .to_bech32();

    // Enterprise address without staking ability, for use by exchanges/etc
    const enterpriseAddr = CardanoWasm.EnterpriseAddress.new(
        env.CARDANO_NETWORK !== 1
            ? CardanoWasm.NetworkInfo.testnet().network_id()
            : CardanoWasm.NetworkInfo.mainnet().network_id(),
        CardanoWasm.StakeCredential.from_keyhash(paymentKeyPub.hash())
    )
        .to_address()
        .to_bech32();

    return {
        rootKey: rootKey,
        accountKey: accountKey,
        paymentKey: paymentKey,
        paymentKeyPub: paymentKeyPub,
        paymentKeyHash: paymentKeyHash,
        stakeKey: stakeKey,
        paymentAddr: paymentAddr,
        enterpriseAddr: enterpriseAddr,
    };
}

async function getAccountBySeedPhrase({ seedPhrase }) {
    try {
        const _seedPhrase = seedPhrase ? seedPhrase : env.ADMIN_SEED_PHRASE;
        const currentWallet = getCurrentAccount({
            mnemonic: env.ADMIN_SEED_PHRASE,
        });
        const lucid = await Lucid.new(null, "Preprod");
        lucid.selectWalletFromPrivateKey(
            getCurrentAccount({
                mnemonic: _seedPhrase,
            }).paymentKey.to_bech32()
        );
        return {
            currentWallet,
            lucidClient: lucid,
        };
    } catch (error) {
        throw error;
    }
}

async function signData(address, payload, password, accountIndex) {
    const keyHash = await extractKeyHash(address);
    const prefix = keyHash.startsWith("addr_vkh") ? "addr_vkh" : "stake_vkh";
    let { paymentKey, stakeKey } = await requestAccountKey(
        password,
        accountIndex
    );
    const accountKey = prefix === "addr_vkh" ? paymentKey : stakeKey;

    const publicKey = accountKey.to_public();
    if (keyHash !== publicKey.hash().to_bech32(prefix))
        throw new Error("Proof of ownership failed");

    const protectedHeaders = CardanoMessage.HeaderMap.new();
    protectedHeaders.set_algorithm_id(
        CardanoMessage.Label.from_algorithm_id(CardanoMessage.AlgorithmId.EdDSA)
    );
    protectedHeaders.set_key_id(publicKey.as_bytes());
    protectedHeaders.set_header(
        CardanoMessage.Label.new_text("address"),
        CardanoMessage.CBORValue.new_bytes(Buffer.from(address, "hex"))
    );
    const protectedSerialized =
        CardanoMessage.ProtectedHeaderMap.new(protectedHeaders);
    const unprotectedHeaders = CardanoMessage.HeaderMap.new();
    const headers = CardanoMessage.Headers.new(
        protectedSerialized,
        unprotectedHeaders
    );
    const builder = CardanoMessage.COSESign1Builder.new(
        headers,
        Buffer.from(payload, "hex"),
        false
    );
    const toSign = builder.make_data_to_sign().to_bytes();

    const signedSigStruc = accountKey.sign(toSign).to_bytes();
    const coseSign1 = builder.build(signedSigStruc);

    stakeKey.free();
    stakeKey = null;
    paymentKey.free();
    paymentKey = null;

    return Buffer.from(coseSign1.to_bytes(), "hex").toString("hex");
}

export {
    getAccountBySeedPhrase,
    signData,
    decryptWithPassword,
    encryptWithPassword,
    getStorage,
};
