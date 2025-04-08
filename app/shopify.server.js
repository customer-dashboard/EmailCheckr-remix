import "@shopify/shopify-app-remix/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
} from "@shopify/shopify-app-remix/server";
import {MongoDBSessionStorage} from '@shopify/shopify-app-session-storage-mongodb';
import { restResources } from "@shopify/shopify-api/rest/admin/2024-01";
import { billingInformation, webhooksInformation } from "./billing";
import { onAppInstall } from "./routes/app.translation";

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  billing: billingInformation,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.October24,
  scopes: process.env.SCOPES?.split(","),
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  sessionStorage: new MongoDBSessionStorage('mongodb+srv://customerdashboardpro:aaPo77bxI4OvaHB8@cluster0.z1pwf.mongodb.net/','email_checker'),
  distribution: AppDistribution.AppStore,
  webhooks: webhooksInformation,
  restResources,
  hooks: {
    afterAuth: async ({ session,admin }) => {
      await shopify.registerWebhooks({ session });
      const data = await onAppInstall(admin,session);
    },
  },
  future: {
    unstable_newEmbeddedAuthStrategy: true,
    removeRest: true,
    v3_webhookAdminContext: true,
  },

  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
    
});


export default shopify;
export const apiVersion = ApiVersion.October24;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;



