import React, { useEffect } from "react";
import {
  Button, Layout, Page, Toast, ResourceList, TextField, Frame, Badge, Collapsible,
  Banner, Text, ProgressBar,
  Card,
  Grid,
  Box,
  InlineStack
} from "@shopify/polaris";
import { useState, useCallback } from "react";
import { useLoaderData, useNavigate, useOutletContext } from 'react-router-dom'
import Above_form from "../assets/image/Above_form.png"
import Before_submit from "../assets/image/Before_submit.png"
import Below_submit from "../assets/image/Below_submit.png"
import { Footer } from '../components/footer'
import PopoverSetting from '../components/Popover'
import SkeletonExample from '../components/SkeletonExample';
import { SaveBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  const {admin,session} = await authenticate.admin(request);
  const { shop } = session;
  
  // let myShop = shop.replace(".myshopify.com", "");
  return shop;
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  return {};
};

export default function Index() {
  const shop = useLoaderData();
  let myShop = shop.replace(".myshopify.com", "");
  const navigate = useNavigate();
  const [setting, setSetting] = useState({});
  const [openStates, setOpenStates] = useState({});
  const [defaultSetting, setdefaultSetting] = useState({});
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [partnerType, setpartnerType] = useState("");
  const [progress, setProgress] = useState(true);
  const [save, setSave] = useState(false);
  const [active, setActive] = useState(false);
  const toggleActive = useCallback(() => setActive((active) => !active), []);
  const {defSetting, setDefSetting, progress2} = useOutletContext();




useEffect(() => {
  setProgress(progress2);
}, [progress2]);

useEffect(() => {
  setSetting(defSetting);
  setpartnerType(defSetting.plan_name);
  setdefaultSetting(defSetting);
  // setProgress(false);
  // console.log("defSetting", defSetting);
}, [defSetting]);

const closePopup = () => {
  console.log("defaultSetting",defaultSetting);
  setSetting(prev => ({ ...defaultSetting })); 
  setSave(false);
};

const submit = async () => {
  let formdata = new FormData();
  formdata.append("_action", "POST_METAFIELD");
  formdata.append("_postMetafileds", JSON.stringify(setting));
  // console.log("postMetafileds", formdata.get("postMetafileds"));  
  setLoading(true);   
  try {
    const response = await fetch("/app/translation", {
      method: "POST",
      body: formdata,
    });
    const responseJson = await response.json();
    setDefSetting(setting);
    // console.log("content",responseJson);
    // console.log("content.data",responseJson.statusText);
    if (response.status === 200) {
      setActive(<Toast content={responseJson.statusText} onDismiss={toggleActive} />);
    }
  } catch (error) {
    console.error("An error occurred:", error.message);
  } finally {
    setLoading(false);
    setSave(false);
  }
}

const selectChange2 = (val, name) => {
  setOpen({
    ...setting,
    [name]: val
  });
}

const persantage = (invited, count) => {
  return Math.round((invited / count) * 100)
}
// console.log("settings", setting);

const cardData = [
  { title: "Invited", color: "primary", content: "View", persantage: persantage(setting?.segment?.invited, setting?.segment?.total), value: setting?.segment?.invited, url: `https://admin.shopify.com/store/${myShop}/customers/segments/${setting?.segment?.id?.invited?.replace("gid://shopify/Segment/", "")}` },
  { title: "Enabled", color: "success", content: "View", persantage: persantage(setting?.segment?.enabled, setting?.segment?.total), value: setting?.segment?.enabled, url: `https://admin.shopify.com/store/${myShop}/customers/segments/${setting?.segment?.id?.enabled?.replace("gid://shopify/Segment/", "")}` },
  { title: "Disabled", color: "critical", content: "View", persantage: persantage(setting?.segment?.disabled, setting?.segment?.total), value: setting?.segment?.disabled, url: `https://admin.shopify.com/store/${myShop}/customers/segments/${setting?.segment?.id?.disabled?.replace("gid://shopify/Segment/", "")}` },
]
// const cardData = [];

const handleActionPlan = async (setloading,name) => {
  setloading(true);
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

const handleColorSetting = (e) => {
  selectChangeColor(Object.values(e)[0], Object.keys(e)[0]);
}

const selectChangeColor = (val, name, pername) => {

  if (defaultSetting[name] === val) setSave(false);
  else setSave(true);
  setSetting((preValue) => {
    let newFormValues = { ...preValue };
    pername ? newFormValues.translation[pername][name] = val : newFormValues[name] = val
    return newFormValues;
  })
};

const selectChange = (val, name, pername) => {
  setSetting((preValue) => {
    let newFormValues = { ...preValue };

    if (pername) {
      newFormValues.translation = {
        ...newFormValues.translation,
        [pername]: {
          ...newFormValues.translation?.[pername],
          [name]: val,
        },
      };
    } else {
      newFormValues[name] = val;
    }

    const hasChanges = checkIfSettingsChanged(newFormValues, defaultSetting);
    setSave(hasChanges); 

    return newFormValues;
  });
};
  
const checkIfSettingsChanged = (currentSettings, defaultSettings) => {
  return JSON.stringify(currentSettings) !== JSON.stringify(defaultSettings);
};

const successMessageDisplayPosition = [
  { title: "Before Form", image: Above_form, value: "beforebegin", description: "This will make the navigation slide like." },
  { title: "Before Submit Button", image: Before_submit, value: "middle", description: "This will make the navigation slide like." },
  { title: "After Submit Button", image: Below_submit, value: "beforeend", description: "This will make the navigation toggle like." },
]

const handleInputChange = (locale, field, value) => {
  setLanguageArrayData((prevData) => ({
    ...prevData,
    [locale]: {
      ...prevData[locale],
      [field]: value,
    },
  }));
};

function capitalizeFLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}

const DeleteMetafields = async () => {
  let formdata = new FormData();
  formdata.append("_action", "DELETE_METAFIELDS");
  if (confirm("are you sure delete all metafields of EmailCheckr") === true) {
    try {
      const response = await fetch("/app/translation", {
        method: "POST",
        body: formdata,
      });
      const responseJson = await response.json();
      setLanguageLocal(responseJson);
      
    } catch (error) {
      console.error("An error occurred:", error.message);
    }
  }
}

const handleToggle = useCallback(
  (locale) => {
    setOpenStates((prevState) => ({
      ...prevState,
      [locale]: !prevState[locale], 
    }));
  },
  [setOpenStates]
);

  return (
    <Frame>
        <SaveBar id="my-save-bar" open={ save }>
          <button variant="primary" onClick={()=> submit()} disabled={loading}></button>
          <button onClick={()=> closePopup()}></button>
        </SaveBar>
      <button
        style={{ display: "none" }}
        onClick={DeleteMetafields}>Delete Metafields</button>
      {
        progress ?
          <SkeletonExample /> :
        <div>
            <Page title='Dashboard'
              primaryAction={{ content: "Installation", onAction: () => navigate("/app/installation") }}
              secondaryActions={[{ content: "Preview", onAction: () => window.open(`https://${shop}/account/register`, "_blank") }]}
            >
              <Layout>
              {setting?.billing?.status === "active" ?
                  null :
                  <Layout.Section fullWidth>
                    <Banner
                      title="EmailCheckr is currently inactive"
                      action={{ loading: loading2, content: 'Start Trial', onAction: () => handleActionPlan(setLoading2,"business") }}
                      tone="warning"
                    >
                      <p>Start 7 day free trial to activate EmailCheckr</p>
                    </Banner>
                  </Layout.Section>
                }
                {/* <Layout.Section >
                  <Card>
                      <InlineStack align='space-between'>
                            <Text as="h2" variant='headingMd'>App status</Text>
                        {setting?.billing?.status === "active" ?<Button  variant={setting?.app_status ? "secondary" : "primary"} onClick={() => selectChange(!setting.app_status, "app_status")}>{setting?.app_status ? "Deactive" : "Active"}</Button>:null}
                     
                      </InlineStack>
                      {<p>EmailCheckr app currently is set to <Badge tone={setting?.app_status ? "success" : "critical"}>{setting?.app_status ? "Active" : "Deactive"}</Badge></p>}
                  </Card>
                </Layout.Section>
                <Layout.Section fullWidth >
                  <Card>
                      <InlineStack align='space-between' className='cd_flex_container'>
                        <Text as='h2' variant='headingMd'>Plan</Text>
                        {
                          setting?.billing?.status === "active" ? <Badge tone="success">Active</Badge> : <Button
                            size='slim'
                            loading={loading3}
                            onClick={() => handleActionPlan(setLoading3,partnerType=="enterprise"?"business+":"business")}
                          >Upgrade plan</Button>
                        }
                      </InlineStack>
                    <Box paddingBlockStart="200">
                      <Text>${partnerType=="enterprise"?9.99:2.99} USD/Month{setting?.billing?.status === "active" ? '' : " ( 7-Days free trial )"}</Text>
                    </Box>
                  </Card>
                </Layout.Section> */}
              
                { 
               setting?.segment?.id?
                <Layout.Section>
                  <Grid>
                      {cardData?.map((ele, index) => (
                          <Grid.Cell key={index} columnSpan={{xs: 6, sm: 3, md: 3, lg: 4, xl: 4}}>
                              <Card>
                            <Text as='h2' variant='headingMd'>{ele.title}</Text>
                            <Box paddingBlockEnd='300' paddingBlockStart='300'>
                            <InlineStack align='space-between' blockAlign='center'>
                            <Text as='h2' variant='headingMd'>{`${ele.value} ${ele.value > 1 ? "Customers" : "Customer"}`}</Text>
                            <Button url={ele.url} target="_blank">View</Button>
                            </InlineStack>
                            </Box>
                            <ProgressBar tone={ele.color} progress={ele.persantage} />
                            </Card>
                        </Grid.Cell>
                      ))}    
                      </Grid>
               </Layout.Section>
              :null
               }
                <Layout.Section>
                <Card> 
               <Box paddingBlockEnd='300'>
               <Text as="h2" variant='headingMd'>Success message display position</Text>
               </Box>
                     <Grid>
                       {
                        successMessageDisplayPosition.map((style, index) => (
                          <Grid.Cell key={index} columnSpan={{xs: 4, sm: 3, md: 3, lg: 4, xl: 4}}>
                              <Card>
                              <img
                                  alt=""
                                  width="100%"
                                  height="100%"
                                  className={setting?.message_position === style.value ? "selected" : null}
                                  style={{
                                    objectFit: 'cover',
                                    objectPosition: 'center',
                                  }}
                                  src={style.image}
                                />
                             
                              <Box  paddingBlockStart={setting?.message_position !== style.value ? "400" : "500"}>
                               <InlineStack align='center'>
                                {
                                  setting.message_position === style.value ? <Badge size='large' tone='success'>Active</Badge> :  
                                  <Button size='medium' onClick={()=>selectChange(style.value, 'message_position')}>
                                  {style.title}
                                 </Button>
                                }
                               </InlineStack>
                              </Box>
                              </Card>
                              </Grid.Cell>
                          ))
                        }
                 </Grid>
                 </Card>
                </Layout.Section>

                {/* <Layout.Section>
                <Card>
                <Box paddingBlockEnd='300'>
                  <Text as="h2" variant='headingMd'>Translations</Text>
               </Box>
                 {
                  setting.translation &&
                  Object.keys(setting?.translation).map((translation, key) => (
                    <Box paddingBlockEnd={400} key={key}>
                      <InlineStack align='space-between' blockAlign='center'>
                        <Text variant="bodyLg" as="p">{capitalizeFLetter(translation)}</Text>
                        <Button
                          variant="plain"
                          onClick={() => handleToggle(translation)}
                          ariaExpanded={!!openStates[translation]}
                          ariaControls={`collapsible-${translation}`}
                        >
                          {openStates[translation] ? "Close" : "Manage translation"}
                        </Button>
                        </InlineStack>
                      {
                      Object.keys(setting?.translation[translation]).map((translation2, key2) => (
                          <Collapsible key={key2}
                            open={!!openStates[translation]}
                            id="basic-collapsible"
                            transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
                            expandOnPrint
                          >
                            <TextField
                              name={translation2}
                              label={translation2.charAt(0).toUpperCase() + translation2.slice(1).replace(/_/g, " ")}
                              value={setting?.translation[translation][translation2]}
                              onChange={(e) => selectChange(e, translation2, translation)}
                              multiline={3}
                              autoComplete="off"
                            />
                          </Collapsible>
                      ))
                      }
                    </Box>
                  ))
                } 
                </Card>
                </Layout.Section> */}

                {/* <Layout.Section>
                  <Card>
                  <Box paddingBlockEnd='300'>
                  <Text as="h2" variant='headingMd'>Color</Text>
                 </Box> 
                    <Box paddingBlockEnd={300}>
                    <ResourceList
                        resourceName={{ singular: 'product', plural: 'products' }}
                        items={[
                          {
                            id: 0,
                            name: 'Main heading color',
                            sku: setting.main_heading_color,
                            media: (
                              <PopoverSetting cd_title="main_heading_color" ColorChange={handleColorSetting} value={setting.main_heading_color} />
                            ),
                          },
                          {
                            id: 1,
                            name: 'Success message text color',
                            sku: setting.success_message_color,
                            media: (
                              <PopoverSetting cd_title="success_message_color" ColorChange={handleColorSetting} value={setting.success_message_color} />
                            ),
                          },
                        ]}
                        renderItem={(item) => {
                          const { id, name, sku, media } = item;
                          return (
                            <ResourceList.Item
                              id={id}
                              media={media}
                              accessibilityLabel={`View details for ${name}`}
                            >
                              <p style={{ fontSize: "12px", fontWeight: "600" }}>{name}</p>
                              <div style={{ fontSize: "12px", fontWeight: "600" }}>{sku}</div>
                            </ResourceList.Item>
                          );
                        }}
                      />
                    </Box>
                  </Card>
                </Layout.Section> */}

                {/* <Layout.Section>
                  <Card>
                  <Box paddingBlockEnd='300'>
                  <Text as="h2" variant='headingMd'>Custom CSS</Text>
                 </Box> 
                    <Box>
                      <TextField
                        placeholder='.style{...}'
                        multiline={8}
                        autoComplete="off"
                        value={setting?.custom_css}
                        name="custom_css"
                        onChange={(e) => selectChange(e, 'custom_css')}
                      />
                    </Box>
                  </Card>
                </Layout.Section> */}
              </Layout>
              {active}
              <Footer /> 
              {/* </Layout> */}
            </Page>
            </div>
      }
    </Frame>
  );
}

// import {
//   Banner,
//   BlockStack,
//   Box,
//   Button,
//   ButtonGroup,
//   Card,
//   Grid,
//   Icon,
//   InlineStack,
//   Layout,
//   LegacyCard,
//   Link,
//   Page,
//   Text,
//   Toast,
// } from "@shopify/polaris";
// import React, { useState, useCallback, useMemo } from "react";
// import {
//   ChatIcon,
//   DiscountCodeIcon,
//   EmailFollowUpIcon,
//   HeartIcon,
//   HomeIcon,
//   MenuHorizontalIcon,
//   QuestionCircleIcon,
//   StarIcon,
//   VariantIcon,
//   XSmallIcon,
// } from "@shopify/polaris-icons";
// import customer_dashboard from "../assets/image/customer-dashboard-pro.png"
// import AnalyticsLegacy from "../universal-components/analytics/index";
// // import "@shopify/polaris-viz/build/esm/styles.css";
// import { useOutletContext } from "@remix-run/react";

// export default function Index(props){
//   const [partnerCollOut, setPartnerCollOut] = useState(() => {
//     // const storedValue = localStorage.getItem("partnerCollOut");
//     // return storedValue !== null ? JSON.parse(storedValue) : true;
//   });

//   const handleCollOutCard = useCallback(() => {
//     setPartnerCollOut((prevState) => {
//       const newState = !prevState;
//       // localStorage.setItem("partnerCollOut", newState);
//       return newState;
//     });
//   }, []);

//   const { defSetting } = useOutletContext();
// console.log("outLet defSetting", defSetting);
//   const analyticsComponent = useMemo(() => {
//     return (
//       <>
//         <AnalyticsLegacy defSetting={defSetting} pageType={"home"} />
//       </>
//     );
//   }, [defSetting]);

//   const DeleteMetafields = async () => {
//     let formdata = new FormData();
//     formdata.append("_action", "DELETE_METAFIELDS");
//     if (confirm("are you sure delete all metafields of EmailCheckr") === true) {
//       try {
//         const response = await fetch("/app/translation", {
//           method: "POST",
//           body: formdata,
//         });
//         const responseJson = await response.json();
//         setLanguageLocal(responseJson);
        
//       } catch (error) {
//         console.error("An error occurred:", error.message);
//       }
//     }
//   }

//   const moreAppsCard = useMemo(() => {
//     // if (!partnerCollOut) return null;
//     return (
//       <Layout.Section variant="fullWidth">
//         <button style={{ display: "none" }} onClick={DeleteMetafields}>Delete Metafields</button>
//         <Card>
//           <div
//             className="show_hide_collapsed_parant"
//             style={{ position: "relative" }} // Add position relative to parent
//             onMouseEnter={(e) => {
//               e.currentTarget.querySelector(
//                 ".show_hide_collapsed"
//               ).style.display = "block";
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.querySelector(
//                 ".show_hide_collapsed"
//               ).style.display = "none";
//             }}
//           >
//             <InlineStack align="space-between" blockAlign="start">
//               <Text as="h2" variant="headingMd">
//                 More apps by Mandasa Technologies
//               </Text>
//               <div
//                 className="show_hide_collapsed gui-GmlnP"
//                 style={{
//                   position: "absolute",
//                   right: "0px",
//                   display: "none", // Initially hidden
//                 }}
//               >
//                 <Button
//                   accessibilityLabel="dd"
//                   icon={XSmallIcon}
//                   onClick={handleCollOutCard}
//                 ></Button>
//               </div>
//             </InlineStack>
//             <BlockStack>
//               <Box paddingBlockStart="400">
//                 <Grid>
//                   <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
//                     <Card>
//                       <InlineStack align="space-between">
//                         <Link
//                           removeUnderline
//                           monochrome
//                           target="_blank"
//                           url="https://apps.shopify.com/checkout-extensions-pro?utm_source=customer-dashboard-pro"
//                         >
//                           <InlineStack gap="300" blockAlign="center">
//                             <img
//                               style={{ width: "50px" }}
//                               src="https://cdn.shopify.com/app-store/listing_images/f0744aa7ec85f7d412692b264a7613a6/icon/CPuq3peN44EDEAE=.png"
//                               alt="checkout extension app image"
//                             />
//                             <Text as="h3" variant="headingMd">
//                               MT: Checkout Rules & Blocks
//                             </Text>
//                           </InlineStack>
//                         </Link>
//                       </InlineStack>
//                       <BlockStack>
//                         <Box paddingBlockStart="300">
//                           <Text>
//                             Customize checkout page with checkout extensibility
//                             and blocks
//                           </Text>
//                         </Box>
//                       </BlockStack>
//                     </Card>
//                   </Grid.Cell>
//                   <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
//                     <Card>
//                       <InlineStack align="space-between">
//                         <Link
//                           removeUnderline
//                           monochrome
//                           target="_blank"
//                           url="https://apps.shopify.com/customer-dashboard-pro"
//                         >
//                           <InlineStack gap="300" blockAlign="center">
//                             <img
//                               style={{ width: "50px" }}
//                               src={customer_dashboard}
//                               alt="Customer Account Pro : MT"
//                             />
//                             <Text as="h3" variant="headingMd">
//                             Customer Account Pro : MT
//                             </Text>
//                           </InlineStack>
//                         </Link>
//                       </InlineStack>
//                       <BlockStack>
//                         <Box paddingBlockStart="300">
//                           <Text>
//                           Engage with your customers throughout their lifecycle
//                           </Text>
//                         </Box>
//                       </BlockStack>
//                     </Card>
//                   </Grid.Cell>
//                 </Grid>
//               </Box>
//             </BlockStack>
//           </div>
//         </Card>
//       </Layout.Section>
//     );
//   }, [partnerCollOut, handleCollOutCard]);

//   const helpSupportCard = useMemo(() => {
//     return (
//       <Layout.Section>
//         <Card>
//           <Text as="h2" variant="headingMd">
//             Help & Support
//           </Text>
//           <Box paddingBlockStart="400">
//             <ButtonGroup fullWidth>
//               <Button
//                 fullWidth
//                 target="_blank"
//                 icon={EmailFollowUpIcon}
//                 size="medium"
//                 url="mailto:cav.support@mandasadevelopment.com"
//               >
//                 Email us
//               </Button>
//               <Button
//                 fullWidth
//                 size="medium"
//                 icon={ChatIcon}
//                 onClick={() => Beacon("open")}
//               >
//                 Live chat
//               </Button>
//               <Button
//                 fullWidth
//                 size="medium"
//                 url="https://customer-dashboard-pro.helpscoutdocs.com"
//                 icon={QuestionCircleIcon}
//               >
//                 Help
//               </Button>
//             </ButtonGroup>
//           </Box>
//         </Card>
//       </Layout.Section>
//     );
//   }, []);

//   return (
//     <Page title="Dashboard">
//       <Layout>
//         {/* <ReviewBanner/> */}
//         {analyticsComponent}
//         {moreAppsCard}
//         {helpSupportCard}
//       </Layout>
//     </Page>
//   );
// }