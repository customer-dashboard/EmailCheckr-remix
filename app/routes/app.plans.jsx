import {
    Page,
} from '@shopify/polaris';
import { useOutletContext } from '@remix-run/react';
import { authenticate } from '../shopify.server';
import { useState } from 'react';
import { BillingPlan } from '../universal-components/billing/billingplan';

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  const {admin,session} = await authenticate.admin(request);
  const { shop } = session;
  let myShop = shop.replace(".myshopify.com", "");
  return myShop;
};

export default function Plan(props) {
    const [progress, setProgress] = useState(false);
    const { onBoarding, defSetting, isShopifyPlus, billingNew } = useOutletContext();
    const billing = defSetting?.billing;
    console.log(defSetting);
    
    const ClickEvent = () => {
        window.open("shopify://admin/apps/customer-account-verification/app", "_self");
      };

    return (
        <>
        {/* <Alert billing={billing} /> */}
        <Page
        {...(onBoarding && billingNew === false ? { backAction: { onAction: ClickEvent } } : {})}
        title={billingNew === false ? "Plan(14 days free trial)" : "Plan" }
        >
        <BillingPlan billingNew={billingNew} isShopifyPlus={isShopifyPlus} />
        </Page>
        </>
    );
}
