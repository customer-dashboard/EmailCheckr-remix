import { Layout, Page } from "@shopify/polaris";
import React, { useMemo } from "react";
// import {AnalyticsLegacy} from "../components-app-old/analytics";
import { useNavigate } from "react-router-dom";
// import AnalyticsView from "../universal-components/analytics/AnalyticsAll";

function analytics(props) {
  const { classic } = props;
  const navigate = useNavigate();

  const analyticsComponent = useMemo(() => {
    if (classic?.customerAccountsVersion === "CLASSIC") {
      return <AnalyticsLegacy {...props} pageType={"analytics"} />;
    } else if (classic?.customerAccountsVersion === "NEW_CUSTOMER_ACCOUNTS") {
      return <AnalyticsView {...props} pageType={"analytics"} />;
    }
    return null;
  }, [classic, props]);

  return (
    <>
      <Page title="Analytics" backAction={{ content: "", onAction: () => navigate("/", {replace:true}) }}>
        <Layout>{analyticsComponent}</Layout>
      </Page>
    </>
  );
}

export default analytics;