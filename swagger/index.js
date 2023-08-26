import { tags } from "./tags.js";
import { responses as components } from "./components.js";
import { paths } from "./paths/index.js";

export const swaggerDocument = {
  openapi: "3.1.0",
  info: {
    version: "v1.0",
    title: "DID Resolver",
    description: "DID resolver for DOMINIUM and COMMONLANDS Projects",
  },
  servers: [
    {
      url: "/resolver",
      description: "Local server",
    },
  ],
  tags: tags,
  components: components,
  paths: paths,
};
