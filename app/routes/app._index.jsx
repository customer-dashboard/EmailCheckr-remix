// import React, { useEffect } from "react";
// import {
//   Button, Layout, Page, Toast, ResourceList, TextField, Frame, Badge, Collapsible,
//   Banner, Text, ProgressBar,
//   Card,
//   Grid,
//   Box,
//   InlineStack
// } from "@shopify/polaris";
// import { useState, useCallback } from "react";
// import { useLoaderData, useNavigate, useOutletContext } from 'react-router-dom'
// import Above_form from "../assets/image/Above_form.png"
// import Before_submit from "../assets/image/Before_submit.png"
// import Below_submit from "../assets/image/Below_submit.png"
// import { Footer } from '../components/footer'
// import PopoverSetting from '../components/Popover'
// import SkeletonExample from '../components/SkeletonExample';
// import { SaveBar } from "@shopify/app-bridge-react";
// import { authenticate } from "../shopify.server";

// export const loader = async ({ request }) => {
//   await authenticate.admin(request);
//   const {admin,session} = await authenticate.admin(request);
//   const { shop } = session;

//   // let myShop = shop.replace(".myshopify.com", "");
//   return shop;
// };

// export const action = async ({ request }) => {
//   const { admin } = await authenticate.admin(request);

//   return {};
// };

// export default function Index() {
//   const shop = useLoaderData();
//   let myShop = shop.replace(".myshopify.com", "");
//   const navigate = useNavigate();
//   const [setting, setSetting] = useState({});
//   const [openStates, setOpenStates] = useState({});
//   const [defaultSetting, setdefaultSetting] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [loading2, setLoading2] = useState(false);
//   const [loading3, setLoading3] = useState(false);
//   const [partnerType, setpartnerType] = useState("");
//   const [progress, setProgress] = useState(true);
//   const [save, setSave] = useState(false);
//   const [active, setActive] = useState(false);
//   const toggleActive = useCallback(() => setActive((active) => !active), []);
//   const {defSetting, setDefSetting, progress2} = useOutletContext();

// useEffect(() => {
//   setProgress(progress2);
// }, [progress2]);

// useEffect(() => {
//   setSetting(defSetting);
//   setpartnerType(defSetting.plan_name);
//   setdefaultSetting(defSetting);
//   // setProgress(false);
//   // console.log("defSetting", defSetting);
// }, [defSetting]);

// const closePopup = () => {
//   console.log("defaultSetting",defaultSetting);
//   setSetting(prev => ({ ...defaultSetting }));
//   setSave(false);
// };

// const submit = async () => {
//   let formdata = new FormData();
//   formdata.append("_action", "POST_METAFIELD");
//   formdata.append("_postMetafileds", JSON.stringify(setting));
//   // console.log("postMetafileds", formdata.get("postMetafileds"));
//   setLoading(true);
//   try {
//     const response = await fetch("/app/translation", {
//       method: "POST",
//       body: formdata,
//     });
//     const responseJson = await response.json();
//     setDefSetting(setting);
//     // console.log("content",responseJson);
//     // console.log("content.data",responseJson.statusText);
//     if (response.status === 200) {
//       setActive(<Toast content={responseJson.statusText} onDismiss={toggleActive} />);
//     }
//   } catch (error) {
//     console.error("An error occurred:", error.message);
//   } finally {
//     setLoading(false);
//     setSave(false);
//   }
// }

// const selectChange2 = (val, name) => {
//   setOpen({
//     ...setting,
//     [name]: val
//   });
// }

// const persantage = (invited, count) => {
//   return Math.round((invited / count) * 100)
// }
// // console.log("settings", setting);

// const cardData = [
//   { title: "Invited", color: "primary", content: "View", persantage: persantage(setting?.segment?.invited, setting?.segment?.total), value: setting?.segment?.invited, url: `https://admin.shopify.com/store/${myShop}/customers/segments/${setting?.segment?.id?.invited?.replace("gid://shopify/Segment/", "")}` },
//   { title: "Enabled", color: "success", content: "View", persantage: persantage(setting?.segment?.enabled, setting?.segment?.total), value: setting?.segment?.enabled, url: `https://admin.shopify.com/store/${myShop}/customers/segments/${setting?.segment?.id?.enabled?.replace("gid://shopify/Segment/", "")}` },
//   { title: "Disabled", color: "critical", content: "View", persantage: persantage(setting?.segment?.disabled, setting?.segment?.total), value: setting?.segment?.disabled, url: `https://admin.shopify.com/store/${myShop}/customers/segments/${setting?.segment?.id?.disabled?.replace("gid://shopify/Segment/", "")}` },
// ]
// // const cardData = [];

// const handleActionPlan = async (setloading,name) => {
//   setloading(true);
//   const data = {name:name}
//   const content = await InstallMetafields('/app/plan', data);
//   // const content = await graphql_billing({data});
//   // console.log("contentPlan", content);
//   window.open(content.data, '_top');
// }

// const InstallMetafields = async (url, data) => {
//   const response = await fetch(url, {
//     method: 'POST',
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(data)
//   });
//   return await response.json();
// }

// const handleColorSetting = (e) => {
//   selectChangeColor(Object.values(e)[0], Object.keys(e)[0]);
// }

// const selectChangeColor = (val, name, pername) => {

//   if (defaultSetting[name] === val) setSave(false);
//   else setSave(true);
//   setSetting((preValue) => {
//     let newFormValues = { ...preValue };
//     pername ? newFormValues.translation[pername][name] = val : newFormValues[name] = val
//     return newFormValues;
//   })
// };

// const selectChange = (val, name, pername) => {
//   setSetting((preValue) => {
//     let newFormValues = { ...preValue };

//     if (pername) {
//       newFormValues.translation = {
//         ...newFormValues.translation,
//         [pername]: {
//           ...newFormValues.translation?.[pername],
//           [name]: val,
//         },
//       };
//     } else {
//       newFormValues[name] = val;
//     }

//     const hasChanges = checkIfSettingsChanged(newFormValues, defaultSetting);
//     setSave(hasChanges);

//     return newFormValues;
//   });
// };

// const checkIfSettingsChanged = (currentSettings, defaultSettings) => {
//   return JSON.stringify(currentSettings) !== JSON.stringify(defaultSettings);
// };

// const successMessageDisplayPosition = [
//   { title: "Before Form", image: Above_form, value: "beforebegin", description: "This will make the navigation slide like." },
//   { title: "Before Submit Button", image: Before_submit, value: "middle", description: "This will make the navigation slide like." },
//   { title: "After Submit Button", image: Below_submit, value: "beforeend", description: "This will make the navigation toggle like." },
// ]

// const handleInputChange = (locale, field, value) => {
//   setLanguageArrayData((prevData) => ({
//     ...prevData,
//     [locale]: {
//       ...prevData[locale],
//       [field]: value,
//     },
//   }));
// };

// function capitalizeFLetter(string) {
//   return string[0].toUpperCase() + string.slice(1);
// }

// const DeleteMetafields = async () => {
//   let formdata = new FormData();
//   formdata.append("_action", "DELETE_METAFIELDS");
//   if (confirm("are you sure delete all metafields of EmailCheckr") === true) {
//     try {
//       const response = await fetch("/app/translation", {
//         method: "POST",
//         body: formdata,
//       });
//       const responseJson = await response.json();
//       setLanguageLocal(responseJson);

//     } catch (error) {
//       console.error("An error occurred:", error.message);
//     }
//   }
// }

// const handleToggle = useCallback(
//   (locale) => {
//     setOpenStates((prevState) => ({
//       ...prevState,
//       [locale]: !prevState[locale],
//     }));
//   },
//   [setOpenStates]
// );

//   return (
//     <Frame>
//         <SaveBar id="my-save-bar" open={ save }>
//           <button variant="primary" onClick={()=> submit()} disabled={loading}></button>
//           <button onClick={()=> closePopup()}></button>
//         </SaveBar>
//       <button
//         style={{ display: "none" }}
//         onClick={DeleteMetafields}>Delete Metafields</button>
//       {
//         progress ?
//           <SkeletonExample /> :
//         <div>
//             <Page title='Dashboard'
//               primaryAction={{ content: "Installation", onAction: () => navigate("/app/installation") }}
//               secondaryActions={[{ content: "Preview", onAction: () => window.open(`https://${shop}/account/register`, "_blank") }]}
//             >
//               <Layout>
//               {setting?.billing?.status === "active" ?
//                   null :
//                   <Layout.Section fullWidth>
//                     <Banner
//                       title="EmailCheckr is currently inactive"
//                       action={{ loading: loading2, content: 'Start Trial', onAction: () => handleActionPlan(setLoading2,"business") }}
//                       tone="warning"
//                     >
//                       <p>Start 7 day free trial to activate EmailCheckr</p>
//                     </Banner>
//                   </Layout.Section>
//                 }
//                 {/* <Layout.Section >
//                   <Card>
//                       <InlineStack align='space-between'>
//                             <Text as="h2" variant='headingMd'>App status</Text>
//                         {setting?.billing?.status === "active" ?<Button  variant={setting?.app_status ? "secondary" : "primary"} onClick={() => selectChange(!setting.app_status, "app_status")}>{setting?.app_status ? "Deactive" : "Active"}</Button>:null}

//                       </InlineStack>
//                       {<p>EmailCheckr app currently is set to <Badge tone={setting?.app_status ? "success" : "critical"}>{setting?.app_status ? "Active" : "Deactive"}</Badge></p>}
//                   </Card>
//                 </Layout.Section>
//                 <Layout.Section fullWidth >
//                   <Card>
//                       <InlineStack align='space-between' className='cd_flex_container'>
//                         <Text as='h2' variant='headingMd'>Plan</Text>
//                         {
//                           setting?.billing?.status === "active" ? <Badge tone="success">Active</Badge> : <Button
//                             size='slim'
//                             loading={loading3}
//                             onClick={() => handleActionPlan(setLoading3,partnerType=="enterprise"?"business+":"business")}
//                           >Upgrade plan</Button>
//                         }
//                       </InlineStack>
//                     <Box paddingBlockStart="200">
//                       <Text>${partnerType=="enterprise"?9.99:2.99} USD/Month{setting?.billing?.status === "active" ? '' : " ( 7-Days free trial )"}</Text>
//                     </Box>
//                   </Card>
//                 </Layout.Section> */}

//                 {
//                setting?.segment?.id?
//                 <Layout.Section>
//                   <Grid>
//                       {cardData?.map((ele, index) => (
//                           <Grid.Cell key={index} columnSpan={{xs: 6, sm: 3, md: 3, lg: 4, xl: 4}}>
//                               <Card>
//                             <Text as='h2' variant='headingMd'>{ele.title}</Text>
//                             <Box paddingBlockEnd='300' paddingBlockStart='300'>
//                             <InlineStack align='space-between' blockAlign='center'>
//                             <Text as='h2' variant='headingMd'>{`${ele.value} ${ele.value > 1 ? "Customers" : "Customer"}`}</Text>
//                             <Button url={ele.url} target="_blank">View</Button>
//                             </InlineStack>
//                             </Box>
//                             <ProgressBar tone={ele.color} progress={ele.persantage} />
//                             </Card>
//                         </Grid.Cell>
//                       ))}
//                       </Grid>
//                </Layout.Section>
//               :null
//                }
//                 {/* <Layout.Section>
//                 <Card>
//                <Box paddingBlockEnd='300'>
//                <Text as="h2" variant='headingMd'>Success message display position</Text>
//                </Box>
//                      <Grid>
//                        {
//                         successMessageDisplayPosition.map((style, index) => (
//                           <Grid.Cell key={index} columnSpan={{xs: 4, sm: 3, md: 3, lg: 4, xl: 4}}>
//                               <Card>
//                               <img
//                                   alt=""
//                                   width="100%"
//                                   height="100%"
//                                   className={setting?.message_position === style.value ? "selected" : null}
//                                   style={{
//                                     objectFit: 'cover',
//                                     objectPosition: 'center',
//                                   }}
//                                   src={style.image}
//                                 />

//                               <Box  paddingBlockStart={setting?.message_position !== style.value ? "400" : "500"}>
//                                <InlineStack align='center'>
//                                 {
//                                   setting.message_position === style.value ? <Badge size='large' tone='success'>Active</Badge> :
//                                   <Button size='medium' onClick={()=>selectChange(style.value, 'message_position')}>
//                                   {style.title}
//                                  </Button>
//                                 }
//                                </InlineStack>
//                               </Box>
//                               </Card>
//                               </Grid.Cell>
//                           ))
//                         }
//                  </Grid>
//                  </Card>
//                 </Layout.Section> */}

//                 {/* <Layout.Section>
//                 <Card>
//                 <Box paddingBlockEnd='300'>
//                   <Text as="h2" variant='headingMd'>Translations</Text>
//                </Box>
//                  {
//                   setting.translation &&
//                   Object.keys(setting?.translation).map((translation, key) => (
//                     <Box paddingBlockEnd={400} key={key}>
//                       <InlineStack align='space-between' blockAlign='center'>
//                         <Text variant="bodyLg" as="p">{capitalizeFLetter(translation)}</Text>
//                         <Button
//                           variant="plain"
//                           onClick={() => handleToggle(translation)}
//                           ariaExpanded={!!openStates[translation]}
//                           ariaControls={`collapsible-${translation}`}
//                         >
//                           {openStates[translation] ? "Close" : "Manage translation"}
//                         </Button>
//                         </InlineStack>
//                       {
//                       Object.keys(setting?.translation[translation]).map((translation2, key2) => (
//                           <Collapsible key={key2}
//                             open={!!openStates[translation]}
//                             id="basic-collapsible"
//                             transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
//                             expandOnPrint
//                           >
//                             <TextField
//                               name={translation2}
//                               label={translation2.charAt(0).toUpperCase() + translation2.slice(1).replace(/_/g, " ")}
//                               value={setting?.translation[translation][translation2]}
//                               onChange={(e) => selectChange(e, translation2, translation)}
//                               multiline={3}
//                               autoComplete="off"
//                             />
//                           </Collapsible>
//                       ))
//                       }
//                     </Box>
//                   ))
//                 }
//                 </Card>
//                 </Layout.Section> */}

//                 {/* <Layout.Section>
//                   <Card>
//                   <Box paddingBlockEnd='300'>
//                   <Text as="h2" variant='headingMd'>Color</Text>
//                  </Box>
//                     <Box paddingBlockEnd={300}>
//                     <ResourceList
//                         resourceName={{ singular: 'product', plural: 'products' }}
//                         items={[
//                           {
//                             id: 0,
//                             name: 'Main heading color',
//                             sku: setting.main_heading_color,
//                             media: (
//                               <PopoverSetting cd_title="main_heading_color" ColorChange={handleColorSetting} value={setting.main_heading_color} />
//                             ),
//                           },
//                           {
//                             id: 1,
//                             name: 'Success message text color',
//                             sku: setting.success_message_color,
//                             media: (
//                               <PopoverSetting cd_title="success_message_color" ColorChange={handleColorSetting} value={setting.success_message_color} />
//                             ),
//                           },
//                         ]}
//                         renderItem={(item) => {
//                           const { id, name, sku, media } = item;
//                           return (
//                             <ResourceList.Item
//                               id={id}
//                               media={media}
//                               accessibilityLabel={`View details for ${name}`}
//                             >
//                               <p style={{ fontSize: "12px", fontWeight: "600" }}>{name}</p>
//                               <div style={{ fontSize: "12px", fontWeight: "600" }}>{sku}</div>
//                             </ResourceList.Item>
//                           );
//                         }}
//                       />
//                     </Box>
//                   </Card>
//                 </Layout.Section> */}

//                 {/* <Layout.Section>
//                   <Card>
//                   <Box paddingBlockEnd='300'>
//                   <Text as="h2" variant='headingMd'>Custom CSS</Text>
//                  </Box>
//                     <Box>
//                       <TextField
//                         placeholder='.style{...}'
//                         multiline={8}
//                         autoComplete="off"
//                         value={setting?.custom_css}
//                         name="custom_css"
//                         onChange={(e) => selectChange(e, 'custom_css')}
//                       />
//                     </Box>
//                   </Card>
//                 </Layout.Section> */}
//               </Layout>
//               {active}
//               <Footer />
//               {/* </Layout> */}
//             </Page>
//             </div>
//       }
//     </Frame>
//   );
// }

import "@shopify/polaris-viz/build/esm/styles.css";
import {
  ActionList,
  Badge,
  Banner,
  BlockStack,
  Box,
  Button,
  ButtonGroup,
  CalloutCard,
  Card,
  Collapsible,
  Divider,
  Grid,
  Icon,
  InlineStack,
  Layout,
  Link,
  Modal,
  Page,
  Popover,
  ProgressBar,
  Select,
  Text,
  TextContainer,
  Thumbnail,
  Toast,
} from "@shopify/polaris";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  ChatIcon,
  EmailFollowUpIcon,
  QuestionCircleIcon,
  XSmallIcon,
} from "@shopify/polaris-icons";
import customer_dashboard from "../assets/image/customer-dashboard-pro.png";
import AnalyticsLegacy from "../universal-components/analytics/index";
// import "@shopify/polaris-viz/build/esm/styles.css";
import { useLoaderData, useNavigate, useOutletContext } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import SkeletonExample from "../components/SkeletonExample";
import { getShopData } from "../Modals/Grapql";
import IndexOnBoarding from "../universal-components/on-boarding/indexOnBoarding";
import OnBoardingNew from "../universal-components/on-boarding/onBoardingNew";
import MyModal from "../components/MyModal";
import { Footer } from "../components/footer";
import HelpSupport from "../components/HelpSupport";

export const loader = async ({ request }) => {
  // await authenticate.admin(request);
  const { admin, session } = await authenticate.admin(request);
  const { shop } = session;

  var shopData = await getShopData(admin, session);
  const customerAccountsVersion = shopData.data.shop.customerAccountsV2;

  // let myShop = shop.replace(".myshopify.com", "");
  return { shop, customerAccountsVersion };
};



export default function Index(props) {
  // const shop = useLoaderData();
  const loaderData = useLoaderData();
  const shop = loaderData.shop;
  let myShop = loaderData.shop.replace(".myshopify.com", "");
  const [partnerCollOut, setPartnerCollOut] = useState(() => {
    // const storedValue = localStorage.getItem("partnerCollOut");
    // return storedValue !== null ? JSON.parse(storedValue) : true;
  });
  const [progress, setProgress] = useState(true);
  const [save, setSave] = useState(false);
  const [active, setActive] = useState(false);
  const [active2, setActive2] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [partnerType, setpartnerType] = useState("");
  const toggleActive = useCallback(() => setActive((active) => !active), []);
  const toggleActive2 = useCallback(
    () => setActive2((active2) => !active2),
    [],
  );
  const [setting, setSetting] = useState({});
  const [defaultSetting, setdefaultSetting] = useState({});
  const [data, setData] = useState({});
  const [state, setState] = useState([]);


  const {
    defSetting,
    setDefSetting,
    progress2,
    allthemes,
    enableTheme,
    appStatus,
    classic,
    onBoarding,
    setOnBoarding,
    isShopifyPlus,
    livetheme,
    billingNew,
  } = useOutletContext();
  const navigate = useNavigate();
  // console.log("OnBoarding", onBoarding);
  const type = classic?.customerAccountsVersion === "CLASSIC"
    ? "CLASSIC"
    : "NEW_CUSTOMER_ACCOUNTS";

  useEffect(() => {
    setState(allthemes);
    setData(enableTheme);
  }, [enableTheme, livetheme]);

  const options = state?.map((ele) => ({
    content: (
      <Text>
        {ele.node.name}{" "}
        {ele.node.role === "MAIN" && <Badge tone="success">Live</Badge>}
      </Text>
    ),
    onAction: () =>
      handleImportedAction(
        ele.node.name,
        ele.node.id.replace(/^.*\//, ""),
        ele.node.role,
      ),
  }));

  const managePage = () => {
    navigate("/app/features/prevent_fake_signups", {
      replace: true,
      state: {
        defSetting,
        progress2
      }
    });
  };

  const handleImportedAction = (name, value, role) => {
    setData({ name, value, role });
    setActive2(false);
  };

  useEffect(() => {
    setProgress(progress2);
  }, [progress2]);

  const billing = setting?.billing;
  const themes = allthemes;
  // const classic = data.customerAccountsVersion;

  useEffect(() => {
    setSetting(defSetting);
    setpartnerType(defSetting.plan_name);
    setdefaultSetting(defSetting);
  }, [defSetting]);

  const handleCollOutCard = useCallback(() => {
    setPartnerCollOut((prevState) => {
      const newState = !prevState;
      localStorage.setItem("partnerCollOut", newState);
      return newState;
    });
  }, []);

  const analyticsComponent = useMemo(() => {
    // if (classic?.customerAccountsVersion === "CLASSIC") {
      return (
        <>
        <Layout.Section variant="oneHalf">
          <Card>
            <Box paddingBlockEnd={100}>
            <Text as="h2" variant="headingMd">
            Validating emails on registration page
            </Text>
          <Box paddingBlockStart={400} paddingBlockEnd={400}>
            <Text as="h2" variant="bodyMd">
            Review and refine your current validation to reduce fake signups.
            </Text>
          </Box>
            <Button onClick={managePage}>Prevent fake signups</Button>
            </Box>
          </Card>
        </Layout.Section>
        {/* <Layout.Section> */}
        <AnalyticsLegacy defSetting={defSetting} pageType={"home"}  />
        {/* </Layout.Section> */}
          {/* <AnalyticsLegacy defSetting={defSetting} pageType={"home"}  /> */}

        </>
      );
    // } else if (classic?.customerAccountsVersion === "NEW_CUSTOMER_ACCOUNTS") {
    //   return (
    //     <>
    //       {/* <BillingAlert billing={billing} pageType={"other"} /> */}
    //       {/* <AnalyticsView {...props} pageType={"home"} /> */}
    //     </>
    //   );
    // }
    return null;
  }, [onBoarding, defSetting]);

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
  };

  const persantage = (invited, count) => {
    if (invited && count) {
      return Math.round((invited / count) * 100);
    }
  };



  const appEmbedOnLiveTheme = async (setLoading2, theme_id) => {
    setLoading2(true);
    let formdata = new FormData();
    formdata.append("_action", "app_embed");
    formdata.append("theme_id", theme_id);
    const response = await fetch("/app/emailCh-api", { method: "POST", body: formdata });
    const responseJson = await response.json();
    // console.log("responseJson", responseJson);
    if (responseJson.status == 200) {
      setLoading2(false);
    }
  };

  const appEmbedOnSelectedTheme = (setLoading2, theme) => {
    console.log(setLoading2);
    console.log(theme);
    console.log(active);
  };

  const nextButtonHandler = () => {
    setLoading3(true);
    navigate("/app/installation", { replace: true });
  };



  const appEmbedBanner = useMemo(() => {
    return (
      <Layout.Section>
        <Banner
          title="Add EmailCheckr to theme"
          action={{
            loading: loading2,
            content: "Add EmailCheckr to live theme",
            onAction: () => {
              window.open(
                `https://${shop}/admin/themes/${livetheme?.value}/editor?context=apps&activateAppId=20384d45f5b73f1e1a6c806428ab773d/app-embed`,
                "_blank"
              );
            },
          }}
          secondaryAction={{
            loading: loading3,
            content: "Try EmailCheckr in other themes",
            onAction: () => { nextButtonHandler() }
          }}
          tone="warning"
        >
          <p>
            Click on “Add EmailCheckr to live theme” to display EmailCheckr
            features on your storefront. You can try EmailCheckr in other themes
            as well. If you close this popup, you can access this option later
            from Settings &gt; Add to Theme.
          </p>
        </Banner>
        <Modal
          open={active}
          onClose={toggleActive}
          title="Try EmailCheckr in other themes"
          primaryAction={{
            content: "Add EmailCheckr to selected theme",
            onAction: "",
          }}
          secondaryActions={[
            {
              content: "Cancel",
              onAction: toggleActive,
            },
          ]}
        >
          <Modal.Section>
            <Box padding={200}>
              <Box paddingBlockEnd={100}>
                <Text as="p" variant="bodyMd">
                  Choose a theme where you want to enable 'EmailCheckr' to
                  display its features on the storefront
                </Text>
              </Box>
              {/* {data.role === "MAIN" ? <Badge tone="success">Live</Badge> : null} */}
              <div className="cdp_popover">
                <Popover
                  fullWidth
                  active={active2}
                  activator={
                    <Button
                      size="medium"
                      fullWidth
                      textAlign="left"
                      onClick={() => setActive2(!active2)}
                      disclosure
                    >
                      <Text> {data?.name} </Text>
                    </Button>
                  }
                  onClose={() => setActive2(false)}
                >
                  <ActionList actionRole="menuitem" items={options} />
                </Popover>
              </div>
            </Box>
          </Modal.Section>
        </Modal>

      </Layout.Section>
    );
  });

  const accountLegacyBanner = useMemo(() => {
    return (
      <Layout.Section>
            <div className='cstm_banner'>
            <Banner
                title='Select the "Legacy" option in your customer accounts settings to ensure compatibility with our app.'
                action={{
                    content: 'Check customer account settings',
                    url: `https://admin.shopify.com/store/${myShop}/settings/customer_accounts`,
                    target: "_blank"
                }}
                // onDismiss={() => setInformation(false)}
                tone="warning"
            />
            </div>
      </Layout.Section>
    );
  });
const cardData = [];
  // const cardData = [
  //   {
  //     title: "Invited",
  //     color: "primary",
  //     content: "View",
  //     persantage: persantage(
  //       setting?.segment?.invited,
  //       setting?.segment?.total,
  //     ),
  //     value: setting?.segment?.invited,
  //     url: `https://admin.shopify.com/store/${myShop}/customers/segments/${setting?.segment?.id?.invited?.replace("gid://shopify/Segment/", "")}`,
  //   },
  //   {
  //     title: "Enabled",
  //     color: "success",
  //     content: "View",
  //     persantage: persantage(
  //       setting?.segment?.enabled,
  //       setting?.segment?.total,
  //     ),
  //     value: setting?.segment?.enabled,
  //     url: `https://admin.shopify.com/store/${myShop}/customers/segments/${setting?.segment?.id?.enabled?.replace("gid://shopify/Segment/", "")}`,
  //   },
  //   {
  //     title: "Disabled",
  //     color: "critical",
  //     content: "View",
  //     persantage: persantage(
  //       setting?.segment?.disabled,
  //       setting?.segment?.total,
  //     ),
  //     value: setting?.segment?.disabled,
  //     url: `https://admin.shopify.com/store/${myShop}/customers/segments/${setting?.segment?.id?.disabled?.replace("gid://shopify/Segment/", "")}`,
  //   },
  // ];


  const customerStatus = useMemo(() => {
    return (
      <Layout.Section>
        {setting?.segment?.id ? (
          <Grid>
            {cardData?.map((ele, index) => (
              <Grid.Cell
                key={index}
                columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }}
              >
                <Card>
                  <Text as="h2" variant="headingMd">
                    {ele.title}
                  </Text>
                  <Box paddingBlockEnd="300" paddingBlockStart="300">
                    <InlineStack align="space-between" blockAlign="center">
                      <Text
                        as="h2"
                        variant="headingMd"
                      >{`${ele?.value} ${ele?.value > 1 ? "Customers" : "Customer"}`}</Text>
                      <Button url={ele.url} target="_blank">
                        View
                      </Button>
                    </InlineStack>
                  </Box>
                  <ProgressBar tone={ele.color} progress={ele.persantage} />
                </Card>
              </Grid.Cell>
            ))}
          </Grid>
        ) : null}
      </Layout.Section>
    );
  });

  const moreAppsCard = useMemo(() => {
    if (!partnerCollOut) return null;
    return (
      <Layout.Section variant="fullWidth">
        <Card>
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
            <InlineStack align="space-between" blockAlign="start">
              <Text as="h2" variant="headingMd">
                More apps by Mandasa Technologies
              </Text>
              <div
                className="show_hide_collapsed gui-GmlnP"
                style={{
                  position: "absolute",
                  right: "16px",
                  display: "none", // Initially hidden
                }}
              >
                <Button
                  accessibilityLabel="dd"
                  icon={XSmallIcon}
                  onClick={handleCollOutCard}
                ></Button>
              </div>
            </InlineStack>
            <BlockStack>
              <Box paddingBlockStart="400">
                <Grid>
                  <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                    <Card>
                      <InlineStack align="space-between">
                        <Link
                          removeUnderline
                          monochrome
                          target="_blank"
                          url="https://apps.shopify.com/checkout-extensions-pro?utm_source=customer-dashboard-pro"
                        >
                          <InlineStack gap="300" blockAlign="center">
                            <img
                              style={{ width: "50px" }}
                              src="https://cdn.shopify.com/app-store/listing_images/f0744aa7ec85f7d412692b264a7613a6/icon/CPuq3peN44EDEAE=.png"
                              alt="checkout extension app image"
                            />
                            <Text as="h3" variant="headingMd">
                              MT: Checkout Rules & Blocks
                            </Text>
                          </InlineStack>
                        </Link>
                      </InlineStack>
                      <BlockStack>
                        <Box paddingBlockStart="300">
                          <Text>
                            Customize checkout page with checkout extensibility
                            and blocks
                          </Text>
                        </Box>
                      </BlockStack>
                    </Card>
                  </Grid.Cell>
                  <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                    <Card>
                      <InlineStack align="space-between">
                        <Link
                          removeUnderline
                          monochrome
                          target="_blank"
                          url="https://apps.shopify.com/customer-dashboard-pro"
                        >
                          <InlineStack gap="300" blockAlign="center">
                            <img
                              style={{ width: "50px" }}
                              src={customer_dashboard}
                              alt="Customer Account Pro : MT"
                            />
                            <Text as="h3" variant="headingMd">
                              Customer Account Pro : MT
                            </Text>
                          </InlineStack>
                        </Link>
                      </InlineStack>
                      <BlockStack>
                        <Box paddingBlockStart="300">
                          <Text>
                            Engage with your customers throughout their
                            lifecycle
                          </Text>
                        </Box>
                      </BlockStack>
                    </Card>
                  </Grid.Cell>
                </Grid>
              </Box>
            </BlockStack>
          </div>
        </Card>
      </Layout.Section>
    );
  }, [partnerCollOut, handleCollOutCard]);


  const handleActionPlan = async (setloading, name) => {
    setloading(true);
    const data = { name: name };
    const content = await InstallMetafields("/app/plan", data);
    // const content = await graphql_billing({data});
    // console.log("contentPlan", content);
    window.open(content.data, "_top");
  };

  const InstallMetafields = async (url, data) => {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  };



  return (
    <>
      {/* {onBoarding ? (
      <IndexOnBoarding {...{ classic, setOnBoarding, appStatus, enableTheme, billing, themes, myShop, isShopifyPlus }} />
    ) : classic?.customerAccountsVersion === "CLASSIC" ? ( */}
      <Page title="Dashboard">
        {progress ? (
          <SkeletonExample />
        ) : (
          <Layout>
          <button 
          style={{ display: "none" }} 
          onClick={DeleteMetafields}>
            Delete Metafields
          </button>
            {/* {setting?.billing?.status !== "active" && (
              <Layout.Section fullWidth>
                <Banner
                  title="EmailCheckr is currently inactive"
                  action={{
                    loading: loading2,
                    content: "Start Trial",
                    onAction: () => handleActionPlan(setLoading2, "business"),
                  }}
                  tone="warning"
                >
                  <p>Start 14 day free trial to activate EmailCheckr</p>
                </Banner>
              </Layout.Section>
            )} */}

            {/* <Layout.Section fullWidth>
              <Card>
                <InlineStack align="space-between" className="cd_flex_container">
                  <Text as="h2" variant="headingMd">Plan</Text>
                  {setting?.billing?.status === "active" ? (
                    <Badge tone="success">Active</Badge>
                  ) : (
                    <Button
                      size="slim"
                      loading={loading3}
                      onClick={() =>
                        handleActionPlan(
                          setLoading3,
                          isShopifyPlus ? "business+" : "business"
                        )
                      }
                    >
                      Upgrade plan
                    </Button>
                  )}
                </InlineStack>

                <Box paddingBlockStart="200">
                  <Text>
                    ${isShopifyPlus === true ? 9.99 : 2.99} USD/Month
                    {setting?.billing?.status === "active"
                      ? ""
                      : " (14-Days free trial)"}
                  </Text>
                </Box>
              </Card>
            </Layout.Section> */}
            {/* {appStatus ? 
            null :
            appEmbedBanner
            } */}
            {classic?.customerAccountsVersion === "CLASSIC" ? 
            null :
            accountLegacyBanner
            }
            {onBoarding ? (
              <OnBoardingNew
                {...{ classic, setOnBoarding, appStatus, enableTheme, billing, themes, type, myShop, isShopifyPlus, allthemes, billingNew }}
              />
            ) : null}
            {analyticsComponent}
            {/* {customerStatus} */}
            {moreAppsCard}
            <HelpSupport />
            {/* <MyModal {...{enableTheme, livetheme, allthemes}} /> */}
          </Layout>
        )}
        <Footer />
      </Page>
      {/* // ) : null} */}
    </>
  );
}
