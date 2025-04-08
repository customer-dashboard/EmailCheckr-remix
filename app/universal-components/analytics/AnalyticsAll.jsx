import { Layout } from "@shopify/polaris";
import React from "react";
import SalesWithDatePicker from "../universal-components/analytics-data/SalesWithDatePicker";
import AnalyticsSekeleton from "../universal-components/analytics-data/AnalyticsSekeleton";

const AnalyticsView = (props) => {
  const { analyticsData, profileData, pageType } = props;
  return (
    <>
      {analyticsData.length == 0 ? (
        <Layout.Section>
          <AnalyticsSekeleton />
        </Layout.Section>
      ) : (
        <Layout.Section>
          <SalesWithDatePicker
            pageType={pageType}
            heading={"Custom fields form Submission"}
            profileData={profileData}
            analyticsData={analyticsData}
          />
        </Layout.Section>
      )}
    </>
  );
};

export default AnalyticsView;