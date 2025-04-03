import {
  BillingInterval,
  DeliveryMethod,
} from "@shopify/shopify-app-remix/server";

export const billingInformation = {
  ["business"]: {
    amount: 2.99,
    currencyCode: "USD",
    interval: BillingInterval.Every30Days,
  },
  ["business+"]: {
    amount: 9.99,
    currencyCode: "USD",
    interval: BillingInterval.Every30Days,
  },
};

export const webhooksInformation = {
  APP_UNINSTALLED: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/webhooks",
  },
  CUSTOMERS_DATA_REQUEST: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/webhooks",
  },
  CUSTOMERS_REDACT: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/webhooks",
  },
  SHOP_REDACT: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/webhooks",
  },
};
