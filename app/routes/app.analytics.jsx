import { Layout, Page } from "@shopify/polaris";
import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AnalyticsView from "../universal-components/analytics/index";
import AnalyticsLegacy from "../universal-components/analytics/index";

function analytics(props) {
  const location = useLocation();
  const { defSetting } = location.state || {};
  // const { classic } = props;
  const navigate = useNavigate();

  const analyticsComponent = useMemo(() => {
    return (
      <AnalyticsLegacy defSetting={defSetting} pageType={"analytics"} />
    );
    // <AnalyticsLegacy defSetting={defSetting} pageType={"analytics"} />
    // if (classic?.customerAccountsVersion === "CLASSIC") {
    //     console.log("here");
    //   // return <AnalyticsView classic={classic} pageType={"analytics"} />;
    // } else if (classic?.customerAccountsVersion === "NEW_CUSTOMER_ACCOUNTS") {
    //   // return <AnalyticsView {...props} pageType={"analytics"} />;
    // }
    
  }, [defSetting, props]);

  return (
    <>
      <Page title="Analytics" backAction={{ content: "", onAction: () => navigate("/app", {replace:true}) }}>
        <Layout>
          {analyticsComponent}
          </Layout>
      </Page>
    </>
  );
}

export default analytics;