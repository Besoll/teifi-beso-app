/// <reference types="vite/client" />
/// <reference types="@remix-run/node" />

declare namespace NodeJS {
    interface ProcessEnv {
        SHOPIFY_ACCESS_TOKEN: string;
        SHOPIFY_API_URL: string;
    }
  }
