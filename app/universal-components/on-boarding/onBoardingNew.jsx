import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActionList,
  Badge,
  BlockStack,
  Box,
  Button,
  ButtonGroup,
  Card,
  Collapsible,
  Divider,
  Grid,
  Icon,
  Image,
  InlineStack,
  Layout,
  MediaCard,
  Popover,
  ProgressBar,
  Text,
} from "@shopify/polaris";
import {
    ChevronDownIcon,
    ChevronUpIcon,
    XSmallIcon,
  } from "@shopify/polaris-icons";
import { useNavigate } from "react-router-dom";
import plan_img from "../../assets/image/Email marketing.png"
import account_status_img from "../../assets/image/Email marketing01.png"
import customer_acc_img from "../../assets/image/Email marketing02.png"

function onBoardingNew(props) {
    const { classic, setOnBoarding, appStatus, enableTheme, billing, themes, type, myShop, isShopifyPlus, allthemes } = props;
  const navigate = useNavigate();
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [data, setData] = useState({});
  const [state, setState] = useState([]);
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(true);
  const [open2, setOpen2] = useState(true);
  const [openTab, setOpenTab] = useState('tab2');
  const [hoveredBox, setHoveredBox] = useState(null);
  const isNewCustomerAccounts = type === "NEW_CUSTOMER_ACCOUNTS";

  const boxStyle = (id) => ({
    padding: 20,
    background: hoveredBox === id ? '#f6f6f7' : 'transparent', 
    transition: 'background 0.3s',
  });

  const handleOnBoarding = useCallback(() => {
    setOnBoarding(false);
    localStorage.setItem(`dp_onboard${myShop}`, JSON.stringify(false));
  }, [myShop]);
  
  useEffect(() => {
    const onboarded = localStorage.getItem(`dp_onboard${myShop}`);
    // console.log("onboarded", onboarded);

    if (onboarded !== null) {
      setOnBoarding(JSON.parse(onboarded));
    }
  }, [myShop]);

//   const getThemes = async () => {
//   themes.forEach(ele => {
//     if (ele.node.role === "MAIN") {
//         setData({ name: ele.node.name, value: (ele.node.id).replace(/^.*\//, ""), role: ele.node.role });
//     }
// });
//   }
useEffect(() => {
  getThemes();
}, [allthemes]);

const getThemes = async () => {
  setState(allthemes);
};

useEffect(() => {
  setData(enableTheme);
}, [enableTheme]);

const handleImportedAction = (name, value, role) => {
  setData({ name, value, role });
  setActive(false);
};

const options = state.map(ele => ({
  content: (
      <Text>{ele.node.name} {ele.node.role === "MAIN" && <Badge tone="success">Live</Badge>}</Text>
  ),
  onAction: () => handleImportedAction(ele.node.name, (ele.node.id).replace(/^.*\//, ""), ele.node.role),
}));

  const themeSelection= useMemo(() => {

      return(
        <InlineStack align="space-between" blockAlign="baseline">
            {/* <Text as="h2" variant="headingSm">Select theme </Text> */}
            {
                state.length > 0 ?
                    <ButtonGroup>
                        {data.role === "MAIN" ? <Badge tone="success">Live</Badge> : null}
                        <div className='cdp_popover'>
                            <Popover
                                active={active}
                                activator={<Button size='slim' onClick={() => setActive(!active)} disclosure>
                                    <Text> {data.name} </Text>
                                </Button>}
                                onClose={() => setActive(false)}
                            >
                                <ActionList
                                    actionRole="menuitem"
                                    items={options}
                                />
                            </Popover>
                        </div>
                        <Button
                          size="slim"
                          variant="primary"
                          disabled={appStatus}
                          onClick={() =>
                            window.open(
                              `https://${myShop}.myshopify.com/admin/themes/${data?.value}/editor?context=apps&activateAppId=20384d45f5b73f1e1a6c806428ab773d/app-embed`,
                              "_blank"
                            )
                          }
                        >
                          Embed
                        </Button>
                    </ButtonGroup> :
                    null
            } 
        </InlineStack>
)
  });

    const handleToggle = useCallback(() => setOpen((open) => !open), []);
    // const handleToggle2 = useCallback(() => setOpen2((open2) => !open2), []);
    const handleToggle2 = useCallback((tabId) => {
      setOpenTab((prevTab) => (prevTab === tabId ? prevTab : tabId));
    }, []);
    
      
    const CircleIcon = () => (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" role="img"><circle cx="10" cy="10" r="8.75" stroke="#BABEC3" strokeWidth="2.5" strokeDasharray="3.5 3.5"></circle></svg>
          );
    const CheckCircleIconb = () => (
      <svg viewBox="0 0 20 20" class="Polaris-Icon__Svg" focusable="false" aria-hidden="true"><path fill-rule="evenodd" d="M0 10a10 10 0 1 0 20 0 10 10 0 0 0-20 0zm15.2-1.8a1 1 0 0 0-1.4-1.4l-4.8 4.8-2.3-2.3a1 1 0 0 0-1.4 1.4l3 3c.4.4 1 .4 1.4 0l5.5-5.5z"></path></svg>
          );
        


  const planUrl = `https://admin.shopify.com/store/${myShop}/themes/${data?.value}/editor?previewPath=%2Faccount%2Fregister&context=apps` 
  const imageUrl = useMemo(
    () =>
      isNewCustomerAccounts
        ? "https://mandasa1.b-cdn.net/cdp_onboarding/app%20status.png"
        : "https://mandasa1.b-cdn.net/cdp_onboarding/app%20embeds.png",
    [isNewCustomerAccounts]
  );

  const title = useMemo(
    () => (isNewCustomerAccounts ? "App embed" : "Enable app embed"),
    [isNewCustomerAccounts]
  );

  const nextButtonHandler = () => {
    setLoading3(true);
    navigate("/app/installation", { replace: true });
  };
  const planPage = () => {
    setLoading2(true);
    navigate("/app/plans", { replace: true });
  };
  const customer_account = () => {
    setLoading1(true);
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

  const totalSteps = 2;
  let completedSteps = 0;
  
  if (appStatus === true) completedSteps += 1;
  // if (!isNewCustomerAccounts === true) completedSteps += 1;
  if (billing?.status !== undefined) completedSteps += 1;
  
  const progress = (completedSteps / totalSteps) * 100;
  // const totalSteps = 3;
  // let completedSteps = 0;
  
  // if (appStatus === true) completedSteps += 1;
  // if (!isNewCustomerAccounts === true) completedSteps += 1;
  // if (billing?.status !== undefined) completedSteps += 1;
  
  // const progress = (completedSteps / totalSteps) * 100;
  

    return (
      <Layout.Section>
        <Card padding={0}>
          <div
            className="show_hide_collapsed_parant"
            style={{ position: "relative" }} // Add position relative to parent
            onMouseEnter={(e) => {
              e.currentTarget.querySelector(
                ".show_hide_collapsed",
              ).style.display = "block";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.querySelector(
                ".show_hide_collapsed",
              ).style.display = "none";
            }}
          >
            <Box padding={500}>
            <BlockStack gap="200">
              <InlineStack align="space-between" blockAlign="start">
                <Text as="h2" variant="headingMd">
                  Onboarding checklist
                </Text>
                <div
                  className="show_hide_collapsed gui-GmlnP"
                  style={{
                    position: "absolute",
                    right: "16px",
                    display: "none",
                  }}
                >
                  <ButtonGroup>
                    <Button
                      accessibilityLabel="dd"
                      variant="tertiary"
                      icon={open ? ChevronUpIcon : ChevronDownIcon}
                      onClick={handleToggle}
                      ariaExpanded={open}
                      ariaControls="basic-collapsible"
                    ></Button>
                    <Button
                      variant="tertiary"
                      accessibilityLabel="dd"
                      icon={XSmallIcon}
                      onClick={handleOnBoarding}
                    ></Button>
                  </ButtonGroup>
                </div>
              </InlineStack>
              <InlineStack blockAlign="center">
                <div style={{ width: "20%" }}>
                    {completedSteps} of {totalSteps} completed
                </div>
                <div style={{ width: "80%" }}>
                    <ProgressBar tone="primary" progress={progress} size="small" />
                </div>
                </InlineStack>
            </BlockStack>
            </Box>

            <Collapsible
              open={open}
              id="basic-collapsible"
              transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
              expandOnPrint
            >
              <Divider />
              {/* <Box paddingBlockStart={200} paddingBlockEnd={500}> */}
              <Box>
                <BlockStack gap="2">
                  {/* step:1 Check account type */}
                  {/* <Box paddingBlockEnd={200} paddingBlockStart={400} paddingInlineStart={500} paddingInlineEnd={500} 
                          style={boxStyle(1)}
                          onMouseEnter={() => setHoveredBox(1)}
                          onMouseLeave={() => setHoveredBox(null)}>
                    <div style={{ flex: 1 }}>
                      <InlineStack gap="400" wrap={false}>
                        <div style={{ flex: 1 }}>
                          <BlockStack gap="100">
                          <InlineStack align="space-between" blockAlign="center" wrap={false} gap={200}>
                          {isNewCustomerAccounts ?
                            <div className="icon_ec">
                            <Icon source={CircleIcon} />
                            </div> :
                            <Icon source={CheckCircleIconb} />
                            }
                          <Button
                                fullWidth
                                textAlign="left"
                                variant="monochromePlain"
                                onClick={() => handleToggle2('tab1')}
                                ariaExpanded={openTab === 'tab1'}
                                ariaControls="collapsible-tab1"
                                >
                            <Text as="h3" variant="headingMd">
                              Set up Account type
                            </Text>
                            </Button>
                            </InlineStack>

                            <Collapsible
                                open={openTab === 'tab1'}
                                id="collapsible-tab1"
                                transition={{ duration: "200ms", timingFunction: "ease-in-out" }}
                                expandOnPrint
                            >
                          <Box paddingInlineStart={600}>
                          {isNewCustomerAccounts ?
                          (<Box paddingBlockEnd={200} paddingInlineStart={100} paddingBlockStart={400}>
                            <Text as="p" variant="bodyMd">
                              Choose a different version of customer account to
                              proceed.
                            </Text>
                            </Box>) : null
                          }                 

                            <Box paddingBlockStart={400}>
                            <InlineStack align="left" gap="2">
                              <Button size="slim" variant="primary" onClick={customer_account}  disabled={!isNewCustomerAccounts}>
                                Set up
                              </Button>
                            </InlineStack>
                            </Box>
                            </Box>
                            </Collapsible>

                          </BlockStack>
                        </div>
                      </InlineStack>
                    </div>
                  </Box> */}

                  {/* step:2 Check App Embed */}
                  <Box paddingBlockEnd={200} paddingBlockStart={200} paddingInlineStart={500} paddingInlineEnd={500} 
                          style={boxStyle(2)}
                          onMouseEnter={() => setHoveredBox(2)}
                          onMouseLeave={() => setHoveredBox(null)}>
                    <div style={{ flex: 1 }}>
                    <InlineStack gap="400" wrap={false}>
                        <div style={{ flex: 1 }}>
                            <BlockStack gap="100">
                            <InlineStack align="space-between" blockAlign="center" wrap={false} gap={200}>
                            {appStatus ?
                              <Icon source={CheckCircleIconb} />
                              :
                              <div className="icon_ec">
                              <Icon source={CircleIcon} />
                              </div> 
                              }
                            <Button
                                fullWidth
                                textAlign="left"
                                variant="monochromePlain"
                                onClick={() => handleToggle2('tab3')}
                                ariaExpanded={openTab === 'tab3'}
                                ariaControls="collapsible-tab3"
                                >
                            <InlineStack align="left" gap={200}>
                                    <Text as="h3" variant="headingMd">
                                    {title}
                                    </Text>
                                    {/* {badge} */}
                            </InlineStack>
                            </Button>
                            </InlineStack>

                            <Collapsible
                                open={openTab === 'tab3'}
                                id="collapsible-tab3"
                                transition={{ duration: "200ms", timingFunction: "ease-in-out" }}
                                expandOnPrint
                            >
                          <Box paddingInlineStart={600}>
                          <Box paddingBlockEnd={200} paddingInlineStart={100} paddingBlockStart={400}>
                            {appStatus ? (
                                <Text variant="bodyMd" as="span">
                                Theme: {enableTheme?.name} {enableTheme?.role == "MAIN" ? <Badge tone="success">Live</Badge> : null}
                                </Text>
                            ) : (
                              <>
                                <Text variant="bodyMd" as="p">
                                App embed is required for app to work & function properly.
                                </Text>
                                <Box paddingBlockStart={400}>
                                {themeSelection}
                                </Box>
                                </>
                            )}
                            </Box>
                            {/* <Box paddingBlockStart={400}>
                            <InlineStack align="left" gap="2">
                                <Button
                                size="slim"
                                variant="primary"
                                // onClick={nextButtonHandler}
                                // loading={loading3}
                                onClick={() =>
                                    window.open(
                                      `https://${myShop}.myshopify.com/admin/themes/${data?.value}/editor?context=apps&activateAppId=20384d45f5b73f1e1a6c806428ab773d/app-embed`,
                                      "_blank"
                                    )
                                  }
                                disabled={appStatus}
                                >
                                Set up
                                </Button>
                            </InlineStack>
                            </Box> */}
                            </Box>
                            </Collapsible>

                            </BlockStack>
                        </div>
                    </InlineStack>

                    </div>
                  </Box>

                  {/* step:3 Check Plan */}
                  <Box paddingBlockEnd={500} paddingBlockStart={200} paddingInlineStart={500} paddingInlineEnd={500} 
                          style={boxStyle(3)}
                          onMouseEnter={() => setHoveredBox(3)}
                          onMouseLeave={() => setHoveredBox(null)}>
                    <div style={{ flex: 1 }}>
                      <InlineStack gap="400" wrap={false}>
                        <div style={{ flex: 1 }}>
                          <BlockStack gap="100">
                            <InlineStack align="space-between" blockAlign="center" wrap={false} gap={200}>
                            {billing?.status === undefined ?
                            <div className="icon_ec">
                            <Icon source={CircleIcon} />
                            </div> :
                            <Icon source={CheckCircleIconb} />
                            }
                          <Button
                                fullWidth
                                textAlign="left"
                                variant="monochromePlain"
                                onClick={() => handleToggle2('tab2')}
                                ariaExpanded={openTab === 'tab2'}
                                ariaControls="collapsible-tab2"
                                >
                            <InlineStack align="left" gap={200}>
                            <Text as="h3" variant="headingMd">
                              Set up plan
                            </Text>
                            {/* <Badge tone="success">Active</Badge> */}
                            </InlineStack>
                         </Button>
                         </InlineStack>

                         <Collapsible
                                open={openTab === 'tab2'}
                                id="collapsible-tab2"
                                transition={{ duration: "200ms", timingFunction: "ease-in-out" }}
                                expandOnPrint
                            >

                          <Box paddingInlineStart={600}>
                              {billing?.status === undefined ? (
                            <Box paddingBlockEnd={200} paddingInlineStart={100} paddingBlockStart={400}>
                            <Text as="p" variant="bodyMd">
                            Start 14 days free trial to activate EmailCheckr
                            </Text>
                            </Box>
                            ) : null }
                            <Box paddingBlockStart={400}>
                            <InlineStack align="left" gap="2">
                              <Button size="slim" variant="primary" onClick={planPage} loading={loading2} disabled={isNewCustomerAccounts || billing?.status === "active"}>
                                Set up
                              </Button>
                            </InlineStack>
                            </Box>
                          </Box>
                            </Collapsible>

                          </BlockStack>
                        </div>
                      </InlineStack>
                    </div>
                  </Box>
                  
                </BlockStack>
                </Box>
            </Collapsible>
          </div>
        </Card>
      </Layout.Section>
    );
}

export default onBoardingNew;