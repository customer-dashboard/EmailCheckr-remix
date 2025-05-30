import {
    Box,
    Button,
    DataTable,
    Icon,
    Layout,
    Text,
    BlockStack,
    SkeletonDisplayText,
    Badge,
    Card,
    InlineStack,
  } from "@shopify/polaris";
  import { CheckIcon } from "@shopify/polaris-icons";
  import { useState } from "react";
//   import BillingAlert from "../../universal-components/BillingAlert";
  
  export const BillingPlan = (props) => {
    const { billing, isShopifyPlus, billingNew } = props;
    // console.log("billingNew", billingNew[0]?.name);
    // const [billing] = useState({count:53334});
    const [loading, setLoading] = useState(-1);
    // const queryParameters = new URLSearchParams(window.location.search);
    // const myappplan = queryParameters.get("myappplan");
    // let test = false;
    // if (myappplan) {
    //   test = true;
    // }
  
    const handleActionPlan = async (name,price) => {
      setLoading(name);
      const data = {name:name}
      const content = await InstallMetafields('/app/plan', data);
      // const content = await graphql_billing({data});
      // console.log("contentPlan", content);
      window.open(content.data, '_top');
    }
    
    const InstallMetafields = async (url, data) => {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      return await response.json();
    }

    // const billinPlanArray = [
    //   {
    //     key: 0,
    //     name: (
    //       <Text variant="headingSm" as="span">
    //         Features
    //       </Text>
    //     ),
    //   },
    //   {
    //     key: 1,
    //     id: "Starter",
    //     name:
    //       billing.app_installed == 0
    //         ? billing.name == "1500+ Customers"
    //           ? "1500+ Customers"
    //           : "0-1500 Customers"
    //         : "Upto 250 Customers",
    //     label:
    //       billing.name == "1500+ Customers"
    //         ? "1500+ Customers"
    //         : "0-1500 Customers",
    //     price: "Free forever",
    //     disable: billing?.count > 250 ? true : false,
    //     button_status: billing?.status == "active" ? "Downgrade" : "Upgrade",
    //     sbody: billing?.count === undefined ? true : false,
    //   },
    //   {
    //     key: 2,
    //     id: "Growth",
    //     name:
    //       billing.app_installed == 0
    //         ? "1501-5000 Customers"
    //         : "250-5000 Customers",
    //     label: "1501-5000 Customers",
    //     price: "$8 USD / month",
    //     disable:
    //       billing.name == "1500+ Customers" || billing?.count > 5000
    //         ? true
    //         : false,
    //     button_status:
    //       billing?.status == "active" &&
    //       (billing?.name == "5001-25000 Customers" ||
    //         billing?.name == "More than 25000 Customers")
    //         ? "Downgrade"
    //         : "Upgrade",
    //     sbody: billing?.count === undefined ? true : false,
    //     recommended:
    //       billing?.count > 250 &&
    //       billing?.count < 5000 &&
    //       billing?.id === undefined
    //         ? true
    //         : false,
    //   },
    //   {
    //     key: 3,
    //     id: "Advanced",
    //     name: "5001-25000 Customers",
    //     label: "5001-25000 Customers",
    //     price: "$12 USD / month",
    //     disable:
    //       billing.name == "1500+ Customers" || billing?.count > 25000
    //         ? true
    //         : false,
    //     button_status:
    //       billing?.status == "active" &&
    //       billing?.name == "More than 25000 Customers"
    //         ? "Downgrade"
    //         : "Upgrade",
    //     sbody: billing?.count === undefined ? true : false,
    //     recommended:
    //       billing?.count > 5000 &&
    //       billing?.count < 25000 &&
    //       billing?.id === undefined
    //         ? true
    //         : false,
    //   },
    //   {
    //     key: 4,
    //     id: "Enterprise",
    //     name: "Over 25000 customers",
    //     label: "More than 25000 Customers",
    //     price: "$20 USD / month",
    //     disable: billing.name == "1500+ Customers" ? true : false,
    //     button_status: "Upgrade",
    //     sbody: billing?.count === undefined ? true : false,
    //     recommended:
    //       billing?.count > 25000 && billing?.id === undefined ? true : false,
    //   },
    // ];

    const plan = !isShopifyPlus
    ? {
        key: 1,
        id: "",
        name: "business",
        label: "Basic",
        price: "$2.99 USD / month",
        disable: billingNew === false ? false : true,
        button_status: billingNew[0]?.status === "ACTIVE" ? "Upgrade" : "Upgrade",
      }
    : {
        key: 1,
        id: "",
        name: "business+",
        label: "Shopify Plus",
        price: "$9.99 USD / month",
        disable: billingNew === false ? false : true,
        button_status: billingNew[0]?.status === "ACTIVE" ? "Upgrade" : "Upgrade",
      };
  
  const billinPlanArray  = [
    {
      key: 0,
      name: (
        <Text variant="headingSm" as="span">
          Features
        </Text>
      ),
      price: 2.99,
      currencyCode: "USD",
    },
    plan,
  ];
  
      
    const checkIcon = <Icon source={CheckIcon} tone="base" />;
    const selectPlan = (name, button_name, disable, skeleton, price) => {
      return skeleton === true ? (
        <div className="plan-button-skeleton">
          <SkeletonDisplayText size="small" />
        </div>
      ) : billingNew[0]?.name == name ? (
        <InlineStack align="center">
          <Button size="slim" disabled>Current plan</Button>
        </InlineStack>
      ) : (
        <InlineStack align="center">
        <Button
          size="slim"
          disabled={disable}
          loading={name == loading}
          primary
          onClick={() => handleActionPlan(name,price)}
        >
          {button_name}
        </Button>
        </InlineStack>
      );
    };
  
    const rows = [
      billinPlanArray.map((plan) => {
        if (plan.key == 0) {
          return plan.name;
        } else {
          return (
            <Box>
              <div style={{ textAlign: "center" }}>
                <Text variant="headingXs" as="h6" alignment="center">
                  {plan.id}
                </Text>
                <Text variant="headingSm" as="h6" alignment="center">
                  {plan.label}
                </Text>
                <Box paddingBlockStart="1">
                  {plan.recommended ? (
                    <Box paddingBlockStart="100" paddingBlockEnd="100">
                      <Badge tone="info">recommended</Badge>
                    </Box>
                  ) : (
                    ""
                  )}
                </Box>
              </div>
            </Box>
          );
        }
      }),
      billinPlanArray.map((plan) => {
        if (plan.key !== 0) {
          return (
            <Box>
              <Text variant="headingMd" as="h6" alignment="center">
                {plan.price}
              </Text>
              <Box paddingBlockStart="100">
                <Text>
                  {selectPlan(
                    plan.name,
                    plan.button_status,
                    plan.disable,
                    plan.sbody,
                    plan.price
                  )}
                </Text>
              </Box>
            </Box>
          );
        }
      }),
    //   ["Custom Fields", checkIcon, checkIcon, checkIcon, checkIcon],
    ["Prevent fake signups", checkIcon],
    ["Real-time country blocker", checkIcon],
    ["Prevent access from restricted regions", checkIcon],
    ["Protect content(texts and images)", checkIcon],
    ["Deactivate right click", checkIcon],
    ["Deactivate keyboard shortcut", checkIcon],
    ["Deactivate inspect", checkIcon],
    ["Customizable templates", checkIcon],

    ];
  
    const postPayment = async (name, price) => {
      setLoading(name);
      const Price = price.substring(1, 3).replace(/\s+/g, "");
      const returnurl = await fetch("/api/graphql-billing", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, test: test, price: Price }),
      });
      const url = await returnurl.json();
      if (url.status == 200) {
        // window.open(
        //   `https://admin.shopify.com/store/${shopName}/apps/customer-dashboard-pro`,
        //   "_top"
        // );
      }
    //   window.open(url.data, "_top");
    };
  
    return (
      <>
        <Layout>
          {/* <BillingAlert billing={billing} pageType={'plan'} /> */}
          <Layout.Section>
            <Card>
              {billing?.count === undefined ? (
                // <SkeletonDisplayText size="small" />
                null
              ) : (
                <Box paddingBlockEnd="400">
                  <Text as="p">
                    Currently you have{" "}
                    <Text variant="headingSm" as="span">
                       {billing.count} customers!
                    </Text>
                  </Text>
                </Box>
              )}
              <DataTable
                columnContentTypes={[
                  "text",
                  "numeric",
                  "numeric",
                  "numeric",
                  "numeric",
                ]}
                headings={[]}
                rows={rows}
              />
            </Card>
          </Layout.Section>
        </Layout>
      </>
    );
  };