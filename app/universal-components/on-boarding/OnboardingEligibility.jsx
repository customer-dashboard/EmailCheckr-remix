import React, { useEffect, useMemo, useState } from "react";
import {
  Badge,
  BlockStack,
  Box,
  Button,
  Grid,
  Image,
  InlineStack,
  MediaCard,
  Text,
} from "@shopify/polaris";
import { useNavigate } from "react-router-dom";
import plan_img from "../../assets/image/Email marketing.png"
import account_status_img from "../../assets/image/Email marketing01.png"
import customer_acc_img from "../../assets/image/Email marketing02.png"

function OnboardingEligibility(props) {
    const { classic, setOnBoarding, appStatus, enableTheme, billing, themes, type, myShop, isShopifyPlus } = props;
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const isNewCustomerAccounts = type === "NEW_CUSTOMER_ACCOUNTS";
  const getThemes = async () => {
  themes.forEach(ele => {
    if (ele.node.role === "MAIN") {
        setData({ name: ele.node.name, value: (ele.node.id).replace(/^.*\//, ""), role: ele.node.role });
    }
});
  }
      useEffect(() => {
          getThemes();
      }, [themes]);


  const planUrl = `https://admin.shopify.com/store/${myShop}/themes/${data?.value}/editor?previewPath=%2Faccount%2Fregister&context=apps` 
  const imageUrl = useMemo(
    () =>
      isNewCustomerAccounts
        ? "https://mandasa1.b-cdn.net/cdp_onboarding/app%20status.png"
        : "https://mandasa1.b-cdn.net/cdp_onboarding/app%20embeds.png",
    [isNewCustomerAccounts]
  );

  const title = useMemo(
    () => (isNewCustomerAccounts ? "App status" : "Enable app embed"),
    [isNewCustomerAccounts]
  );

  const nextButtonHandler = () => {
    navigate("/app/installation", { replace: true });
  };
  const planPage = () => {
    navigate("/app/plans", { replace: true });
  };
  const customer_account = () => {
    window.open(`//admin.shopify.com/store/${myShop}/settings/customer_accounts`, '_blank');
  };
  const badge = useMemo(() => {
    // if (!isNewCustomerAccounts) {
      return appStatus ? (
        <Badge tone="success">Enabled</Badge>
      ) : (
        <Badge tone="critical">Disabled</Badge>
      );
    // }
    // return null;
  }, [appStatus, isNewCustomerAccounts]);

  const totalSteps = isNewCustomerAccounts ? 3 : 2;



  return (
    <>
      {
        isNewCustomerAccounts ? <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }}>
        <MediaCard portrait>
        <Box paddingBlockEnd="200" paddingBlockStart="200">
          <Text variant="bodyMd" as="h6" alignment="center">Step 1 of {totalSteps}</Text>
          </Box>
          <Image width="100%" source={customer_acc_img} />
          <Box padding="300">
            <BlockStack gap="200">
              <Box paddingBlockEnd="100">
                <InlineStack align="space-between">
                  <Text variant="headingMd" as="h6">
                  Account type
                  </Text>
                </InlineStack>
              </Box>
              <Box paddingBlockEnd="100">
                <Text variant="bodyMd" as="p">
                Choose a different version of customer account to proceed.
                </Text>
              </Box>
              <Box paddingBlockStart="200">
                <Button onClick={customer_account} size="slim">
                  Next
                </Button>
              </Box>
            </BlockStack>
          </Box>
        </MediaCard>
      </Grid.Cell>
      : null
      }
      
        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }}>
          <MediaCard portrait>
        <Box paddingBlockEnd="200" paddingBlockStart="200">
      <Text variant="bodyMd" as="h6" alignment="center">Step {isNewCustomerAccounts ? 2 : 1} of {totalSteps}</Text>
      </Box>
            <Image
              width="100%"
              source={plan_img}
            />
            <Box padding="300">
              <BlockStack gap="200">
                <Box paddingBlockEnd="100">
                  <InlineStack align="space-between">
                    <Text variant="headingMd" as="h6">
                      Plans
                    </Text>
                  </InlineStack>
                </Box>
                <Box paddingBlockEnd="100">
                  <Text variant="bodyMd" as="p">
                  Select between Basic and Shopify Plus accounts.
                  </Text>
                </Box>
                <Box paddingBlockStart="200">
                <Button onClick={planPage} disabled={isNewCustomerAccounts} size="slim">
                  Next
                </Button>
                </Box>
              </BlockStack>
            </Box>
          </MediaCard>
        </Grid.Cell>

        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }}>
        <MediaCard portrait>
        <Box paddingBlockEnd="200" paddingBlockStart="200">
        <Text variant="bodyMd" as="p" alignment="center">
        Step {isNewCustomerAccounts ? 3 : 2} of {totalSteps} 
        </Text>
        </Box>
          <Image width="100%" source={account_status_img} />
          <Box padding="300">
            <BlockStack gap="200">
              <Box paddingBlockEnd="100">
                <InlineStack align="space-between">
                  <Text variant="headingMd" as="h6">
                    {title}
                  </Text>
                  {badge}
                </InlineStack>
              </Box>
              <Box paddingBlockEnd="100">
                {appStatus ? <Text variant="headingMd" as="span">Theme: {enableTheme?.name}</Text> :
                <Text variant="bodyMd" as="p">
                App Embed is required for app to work & function properly.
                </Text>
                }
              </Box>
              <Box paddingBlockStart="200">
                <Button onClick={nextButtonHandler} disabled={isNewCustomerAccounts || billing === undefined} size="slim">
                  Next
                </Button>
              </Box>
            </BlockStack>
          </Box>
        </MediaCard>
      </Grid.Cell>

    </>
  );
}

export default OnboardingEligibility;