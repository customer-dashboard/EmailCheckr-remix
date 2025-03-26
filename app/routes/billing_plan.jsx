
import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";


export async function action({ request }) {
  const { billing, session } = await authenticate.admin(request);
  const data = await request.formData();
  let testMode = false;
  let planName = data.get("planName");
  let trialDay = data.get("trialDay");
  let CurrentPlanId = data.get("CurrentPlanId");
  let planMode = data.get("planMode");
 if (planMode == 'true') {
  testMode = true;
 }else{
  testMode = false;
 }
  
  let fullTrialDays = 14;
  let availableTrialDays = fullTrialDays - trialDay;
  let { shop } = session;
  let myShop = shop.replace(".myshopify.com", "");
   availableTrialDays <= 0 && CurrentPlanId != undefined ? await billing.require({
    plans: [planName],
    onFailure: async () =>
      billing.request({
        plan: planName,
        isTest: testMode,
        returnUrl: `https://admin.shopify.com/store/${myShop}/apps/email-checkr/app`,
      }),
  }) : await billing.require({
    plans: [planName],
    onFailure: async () =>
      billing.request({
        plan: planName,
        trialDays: availableTrialDays,
        // isTest: testMode,
        // returnUrl:`https://admin.shopify.com/store/${myShop}/apps/testnew-customer-dashboard/app`
        isTest: testMode,
        returnUrl: `https://admin.shopify.com/store/${myShop}/apps/email-checkr/app`,
      }),
  });
  console.log("bilingdatabbb", data);
  console.log("bilingdatabbb", billing);
  return json({ billing, data });
}