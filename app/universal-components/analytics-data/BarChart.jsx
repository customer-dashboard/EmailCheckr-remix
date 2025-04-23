import { BarChart, PolarisVizProvider } from "@shopify/polaris-viz";
import { Text, Box, InlineStack, Button, Tooltip } from "@shopify/polaris";
import "@shopify/polaris-viz/build/esm/styles.css";
import { useNavigate } from "@remix-run/react";
import { SearchResourceIcon } from "@shopify/polaris-icons";
import "../../components/style.css"

export default function barChart(props) {
  const { data, title, count, pageType, defSetting, selectedRange } = props;
  // console.log("selectedRange", selectedRange);
  // console.log("data", data);
  // console.log("count", count);
  // console.log("pageType", pageType);
  // const data = [
  //   {
  //     "name": "Enabled",
  //     "data": [
  //       { "key": "01-Apr-2025", "value": 5 },
  //       { "key": "02-Apr-2025", "value": 3 },
  //       { "key": "03-Apr-2025", "value": 3 },
  //     ]
  //   },
  //   {
  //     "name": "Disabled",
  //     "data": [
  //       { "key": "01-Apr-2025", "value": 2 },
  //       { "key": "02-Apr-2025", "value": 1 },
  //       { "key": "03-Apr-2025", "value": 1 },
  //     ]
  //   },
  //   {
  //     "name": "Invited",
  //     "data": [
  //       { "key": "01-Apr-2025", "value": 1 },
  //       { "key": "02-Apr-2025", "value": 0 },
  //       { "key": "03-Apr-2025", "value": 5 },
  //     ]
  //   }
  // ]
  
const totalEnabled = data
.find(item => item.name === "Enabled")
?.data.reduce((sum, entry) => sum + entry.value, 0);

const CustomerStatusTotals = ({ data }) => {
  const getTotalByName = (name) => {
    return (
      data.find((item) => item.name === name)?.data.reduce((sum, entry) => sum + entry.value, 0) || 0
    );
  };

  const totalEnabled = getTotalByName("Enabled");
  const totalDisabled = getTotalByName("Disabled");
  const totalInvited = getTotalByName("Invited");

  return (
    <InlineStack gap="400">
      <Text as="span" fontWeight="medium">Enabled: {totalEnabled}</Text>
      <Text as="span" fontWeight="medium">Disabled: {totalDisabled}</Text>
      <Text as="span" fontWeight="medium">Invited: {totalInvited}</Text>
    </InlineStack>
  );
};

// console.log("Total Enabled:", totalEnabled);

  const navigate = useNavigate();
  return (
    <PolarisVizProvider
    >
      <Box paddingBlockEnd="200">
        <InlineStack align="space-between">
          <Text variant="headingMd" as="h2">
            {title}
          </Text>
          <Text as="h5">
          {pageType === "home" ? null : selectedRange } 
          </Text>
        </InlineStack>
          {pageType === "home" ?
          <Box paddingBlockStart={200} paddingBlockEnd={200}>
          <Text variant="bodyMd" as="h2">
            Total Enabled Customers
          </Text>
          </Box>
          : null }
        <Box paddingBlockStart="200" paddingBlockEnd="200">
         <InlineStack align='space-between'>
         <Text as="h5" variant="headingMd">
         {pageType === "home" ? totalEnabled : count} 
          </Text>
          {pageType === "home" && (
            <Tooltip
              content={
                <Text as="span" variant="bodyMd" tone="subdued">
                  View analytics
                </Text>
              }
            >
              <Button
                variant="plain"
                icon={SearchResourceIcon}
                onClick={() => navigate("/app/analytics", {
                  replace: true,
                  state: {
                    defSetting: defSetting
                  }
                })}
              ></Button>
            </Tooltip>
          )}
         </InlineStack>
        </Box>
      </Box>
      {pageType === "home" ? null : <BarChart data={data} />}
      {pageType === "home" ? null : <CustomerStatusTotals data={data} /> }
    </PolarisVizProvider>
  );
}