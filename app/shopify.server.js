import "@shopify/shopify-app-remix/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  DeliveryMethod,
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
  sessionStorage: new MongoDBSessionStorage('mongodb+srv://emailCheckr:12345@cluster0.z1pwf.mongodb.net/','sample_mflix'),
  distribution: AppDistribution.AppStore,
  webhooks: webhooksInformation,
  restResources,
  hooks: {
    afterAuth: async ({ session,admin }) => {
      await shopify.registerWebhooks({ session });
      const data = await onAppInstall(admin,session);
      // console.log("🚀 ~ afterAuth:", data);
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

// console.log("SHOPIFY_API_KEY:", process.env.SHOPIFY_API_KEY);
// console.log("SHOPIFY_API_SECRET:", process.env.SHOPIFY_API_SECRET);
// console.log("SCOPES:", process.env.SCOPES);
// console.log("SHOPIFY_APP_URL:", process.env.SHOPIFY_APP_URL);


export default shopify;
export const apiVersion = ApiVersion.October24;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;





// export async function registerWebhooks(session) {
//   const response = await shopify.registerWebhooks({
//     session,
//     path: '/app-uninstalled',
//     topic: 'APP_UNINSTALLED',
//   });

//   if (response.success) {
//     console.log('Webhook registered successfully');
//   } else {
//     console.error('Failed to register webhook', response.result);
//   }
// }


// export async function graphQLRequest({ shop, accessToken, query, variables }) {
//   try {
//     const url = `https://${shop}/admin/api/${LATEST_API_VERSION}/graphql.json`;
//     const requestHeaders = {
//       'X-Shopify-Access-Token': accessToken,
//       'Content-Type': 'application/json',
//     };

//     const response = await axios.post(
//       url,
//       {
//         query,        // The GraphQL query string
//         variables,    // The variables for the query
//       },
//       {
//         headers: requestHeaders, // Pass headers here
//       }
//     );

//     return response.data; 
//   } catch (error) {
//     console.log('error', error);
//     throw error; // Re-throw the error if you want it to be handled by the calling function
//   }
// }
// export async function restRequest({ shop, accessToken, path }) {
//   try {

//     const url = `https://${shop}/admin/api/${ LATEST_API_VERSION }/${path}`;
//     const requestHeaders = {
//       'X-Shopify-Access-Token': accessToken,
//     }
    
//     const data = await fetch(url, {headers:requestHeaders});
//     return data.json();

//   } catch (error) {
//     console.log('error', error)
//   }
// }