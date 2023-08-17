import { tags } from "./tags.js";
import { responses as components } from "./components.js";
import { paths } from "./paths/index.js";

export const swaggerDocument = {
  openapi: "3.0.9",
  info: {
    version: "1.0.0",
    title: "DID Resolver",
    description: "DID resolver for Cardano project | Fuixlabs",
  },
  servers: [
    {
      url: "/resolver",
      description: "Local server",
    },
    {
      url: "https://enigmatic-sands-00024.herokuapp.com/18.139.84.180:8000/resolver",
      description: "Remote server",
    },
  ],
  schemes: ["http", "https"],
  ...tags,
  components: {
    ...components,
  },
  ...paths,
};
