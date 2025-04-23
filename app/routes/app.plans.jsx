import {
    Page,
} from '@shopify/polaris';
import { useOutletContext } from '@remix-run/react';
import { authenticate } from '../shopify.server';
import { useState } from 'react';
import Alert from '../universal-components/billing/Alert';
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
    const { onBoarding, defSetting, isShopifyPlus } = useOutletContext();
    const billing = defSetting?.billing;
    const ClickEvent = () => {
        window.open("shopify://admin/apps/customer-account-verification/app", "_self");
      };

    return (
        <>
        {/* <Alert billing={billing} /> */}
        <Page
        {...(onBoarding && billing.status == undefined ? { backAction: { onAction: ClickEvent } } : {})}
        title={billing?.status == 'active' ? "Plan" : "Plan(14 days free trial)" }
        >
        <BillingPlan billing={billing} isShopifyPlus={isShopifyPlus} />
        </Page>
        </>
    );
}
