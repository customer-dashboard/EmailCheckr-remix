import { authenticate } from "../shopify.server";
import { hasBillingCheck, hasBillingRequest } from "../Modals/Grapql";
import { GetCollectionMongoDB } from "../server/mongodb";
import { billingConfig } from "./billing";

export function dateDiffInDays(a, b) {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

export async function action({ request }) {
  const { admin, session, billing } = await authenticate.admin(request);
  let response = {status:200};
  let { shop, accessToken } = session;
  const reqData = await request.json();  

  let data = [];
  const { name } = reqData;
  // console.log("name", name);
  data = await GetCollectionMongoDB("trialdays",shop);
  // console.log("datafromMongo", data);
  if (data == null) {
    billingConfig[name].trialDays = 14;
  } else {
    if (data.plan_subscription != "" && data.cancel_subscription == "1") {
      const a = new Date(data.plan_subscription);
      const b = new Date();
      let countDays = dateDiffInDays(a, b);
      billingConfig[name].trialDays = countDays < 14 ? 14 - countDays : 0;
    } else {
      const a = new Date(data.plan_subscription);
      const b = new Date(data.cancel_subscription);
      let countDays = dateDiffInDays(a, b);
      billingConfig[name].trialDays = countDays < 14 ? 14 - countDays : 0;
    }
  }

  const hasPayment = await hasBillingCheck(session,billing,name);
  // console.log("billing_hasPayment", hasPayment);
  const billing_data = await hasBillingRequest(session,billing,name);
  // console.log("billing_data", billing_data);
  if (hasPayment.hasActivePayment) {
    return new Response(JSON.stringify({ message: "Success" }), { status: 200 });
  } else {
    return({data: await hasBillingRequest(session,billing,name)});
  }

}
