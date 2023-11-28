import "dotenv/config";
import { cleanEnv, port, str, url, num } from "envalid";

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
});

const PLOT_STATUSES = {
    "F&C": {
        label: "Free & Clear",
        color: "#5EC4AC",
        description:
            "This plot has been granted an official Commonlands Certificate and is in good standing. Owners are free to utilize the plot for securing contracts if desired and have the ability to sell or trade it.",
    },
    pending: {
        label: "Pending",
        color: "#FFF9C1",
        description:
            "This plot has been established, but it is linked to a Claimchain that has not yet reached 150 undisputed plots. As a result, a certificate has not been issued. Encourage more individuals to register their plots to activate this claim.",
    },
    boundaryDispute: {
        label: "Boundary Dispute",
        color: "#FFC329",
        description:
            "This plot is experiencing one or more boundary disputes in which two or more owners acknowledge each other as neighbors but cannot agree on their shared boundaries. Although ownership of the plot is undisputed, the exact boundaries remain unclear.",
    },
    ownershipDispute: {
        label: "Ownership Dispute",
        color: "#FF7070",
        description:
            "This plot, or a portion of it, is subject to a dispute between two or more owners who do not acknowledge one another. Exercise caution in relation to any attempts to sell this plot or use it to secure contracts.",
    },
    locked: {
        label: "Locked",
        color: "#61C7DF",
        description:
            "This plot is currently being utilized to secure a contract. Due to its locked status, it cannot be used to secure additional contracts, nor can it be sold or transferred at this time.",
    },
    default: {
        label: "Default",
        color: "#DF5353",
        description:
            "This plot was previously used to secure a contract that is now in default. Exercise caution when engaging in any business transactions with the owner of this plot.",
    },
};

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

export { env, PLOT_STATUSES, NETWORK_ID, REQUEST_TYPE, WRAPPED_DOCUMENT_TYPE };
