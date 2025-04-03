import { BarChart, PolarisVizProvider } from "@shopify/polaris-viz";
import { Text, Box, InlineStack, Button, Tooltip } from "@shopify/polaris";
import "@shopify/polaris-viz/build/esm/styles.css";
import { useNavigate } from "@remix-run/react";
import { SearchResourceIcon } from "@shopify/polaris-icons";

export default function barChart(props) {
  const {  title, count, pageType } = props;
  // console.log("data", data);
  // console.log("title", title);
  // console.log("count", count);
  // console.log("pageType", pageType);
  const data = [
    {
      "name": "Enabled",
      "data": [
        { "key": "01-Apr-2025", "value": 5 },
        { "key": "02-Apr-2025", "value": 3 },
        { "key": "03-Apr-2025", "value": 3 },
      ]
    },
    {
      "name": "Disabled",
      "data": [
        { "key": "01-Apr-2025", "value": 2 },
        { "key": "02-Apr-2025", "value": 1 },
        { "key": "03-Apr-2025", "value": 1 },
      ]
    },
    {
      "name": "Invited",
      "data": [
        { "key": "01-Apr-2025", "value": 1 },
        { "key": "02-Apr-2025", "value": 0 },
        { "key": "03-Apr-2025", "value": 5 },
      ]
    }
  ]
  
  const navigate = useNavigate();
  return (
    <PolarisVizProvider
      themes={{
        Light: {
          tooltip: {
            backgroundColor: 'MidnightBlue',
            valueColor: 'yellow',
            labelColor: 'Fuchsia',
          },
          legend: {
            backgroundColor: "white",
          },
        },
      }}
    >
      <Box paddingBlockEnd="200">
        <InlineStack align="space-between">
          <Text variant="headingMd" as="h2">
            {title}
          </Text>
          <Text as="h5">
          Last 7 days
          </Text>
        </InlineStack>
        <Box paddingBlockStart="200" paddingBlockEnd="200">
         <InlineStack align='space-between'>
         <Text as="h5" variant="headingMd">
            {count} 
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
                onClick={() => navigate("/analytics", { replace: true })}
              ></Button>
            </Tooltip>
          )}
         </InlineStack>
        </Box>
      </Box>
      <BarChart data={data} isAnimated={true} theme="Light" />
    </PolarisVizProvider>
  );
}