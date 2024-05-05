import { cleanEnv, port, str, url, num } from "envalid";
import dotenv from "dotenv";

dotenv.config();

const env = cleanEnv(process.env, {
    DID_CONTROLLER: url({
        default: "http://localhost:58003",
    }),
    CARDANO_SERVICE: url(),
    AUTHENTICATION_SERVICE: url({
        default: "http://18.139.84.180:12000",
    }),
    ALGORAND_SERVICE: url({}),
    MESSAGE_QUEUE: url({
        default: "amqp://localhost",
    }),
    COMPANY_NAME: str(),
    DEV_COMPANY_NAME: str({
        default: "fuixlabs",
    }),
    DAPP_KEY: str({
        default: "dapp_dominium",
    }),
    ADMIN_PUBLIC_KEY: str(),
    ADMIN_SEED_PHRASE: str(),
    ADMIN_PRIVATE_KEY: str(),
    RABBITMQ_PORT: port(),
    MONGO_PORT: port({
        default: 27017,
    }),
    SERVER_PORT: port({
        default: 8000,
    }),
    CARDANO_NETWORK: num({
        choices: [1, 2, 3],
    }),
    RABBITMQ_SERVICE: str(),
    RABBITMQ_USER: str({
        default: "guest",
    }),
    RABBITMQ_PASSWORD: str({
        default: "guest",
    }),
    NODE_ENV: str({
        choices: ["dev", "production", "test"],
        default: "dev",
    }),
    MONGO_DB_NAME: str({
        default: "backup-blockchain",
    }),
    SERVER_TIMEOUT: num({
        default: 30000,
    }),
    MONGO_HOST: str({}),
    CRON_REMINDER: str({
        default: "*/20 * * * * *",
    }),
    REDIS_PORT: port({
        default: 6379,
    }),
    REDIS_PASSWORD: str({
        default: "password",
    }),
});

const NETWORK_ID = {
    mainnet: "mainnet",
    testnet: "testnet",
    preview: "preview",
    preprod: "preprod",
};

const REQUEST_TYPE = {
    MINT: "mint",
    BURN: "burn",
    UPDATE: "update",
    PLOT_MINT: "plot_mint",
    MINT_CREDENTIAL: "mint_credential",
    ADD_CLAIMANT: "add_claimant",
};

const WRAPPED_DOCUMENT_TYPE = {
    PLOT_CERTIFICATE: "Plot-Certificate",
    LOAN_CONTRACT: "Loan-Contract",
};

const isTestEnv = env.NODE_ENV === "test";

export { env, NETWORK_ID, REQUEST_TYPE, WRAPPED_DOCUMENT_TYPE, isTestEnv };
