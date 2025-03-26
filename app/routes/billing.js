import { BillingInterval } from "@shopify/shopify-api";
export const billingConfig = {
  "business": {
    amount: 2.99,
    currencyCode: "USD",
    interval: BillingInterval.Every30Days,
  },
  "business+": {
    amount: 9.99,
    currencyCode: "USD",
    interval: BillingInterval.Every30Days,
  },
};