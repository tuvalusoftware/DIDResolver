import "dotenv/config";

export const PLOT_STATUSES = {
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

export const SERVERS = {
    DID_CONTROLLER: process.env.DID_CONTROLLER,
    CARDANO_SERVICE: process.env.CARDANO_SERVICE || "http://localhost:10003",
    AUTHENTICATION_SERVICE:
        process.env.AUTHENTICATION_SERVICE || "http://localhost:12000",
    ALGORAND_SERVICE: process.env.ALGORAND_SERVICE || "http://localhost:10005",
    STAGING_SERVER:
        process.env.STAGING_SERVICE || "https://commonlands-user.ap.ngrok.io/",
    COMMONLANDS_GITHUB_SERVICE:
        process.env.COMMONLANDS_GITHUB_SERVICE ||
        "https://commonlands-gitdb.ap.ngrok.io",
    TASK_QUEUE_SERVICE:
        process.env.TASK_QUEUE_SERVICE || "http://localhost:18000",
    RABBITMQ_SERVICE: process.env.MESSAGE_QUEUE || "amqp://localhost",
};

export const NETWORK_ID = {
    mainnet: "mainnet",
    testnet: "testnet",
    preview: "preview",
    preprod: "preprod",
};

export const REQUEST_TYPE = {
    MINT: "mint",
    BURN: "burn",
    UPDATE: "update",
    PLOT_MINT: "plot_mint",
    MINT_CREDENTIAL: "mint_credential",
    ADD_CLAIMANT: "add_claimant",
};

export const ADMIN_PUBLIC_KEY = process.env.ADMIN_PUBLIC_KEY;
export const ADMIN_PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY;
export const COMPANY_NAME = process.env.COMPANY_NAME;
export const DEV_COMPANY_NAME = process.env.DEV_COMPANY_NAME;
