// import { Button, Layout, Page, Toast, TextField, RangeSlider, Text, Box, Modal, ChoiceList, Card, InlineGrid, Divider, Banner, InlineStack, Badge, Tooltip, Icon, BlockStack, RadioButton } from '@shopify/polaris'
// import React, { useEffect } from "react";
// import { useState, useCallback } from "react";
// import { useLoaderData, useNavigate, useOutletContext } from 'react-router-dom'
// import Above_form from "../assets/image/Above_form.png"
// import Before_submit from "../assets/image/Before_submit.png"
// import Below_submit from "../assets/image/Below_submit.png"
// import { Footer } from '../components/footer'
// import PopoverSetting from '../components/Popover'
// import SkeletonExample from '../components/SkeletonExample';
// import { SaveBar, TitleBar } from "@shopify/app-bridge-react";
// import { AlertCircleIcon } from '@shopify/polaris-icons';
// import { authenticate } from '../shopify.server';


// export const loader = async ({ request }) => {
//   await authenticate.admin(request);
//   const {admin,session} = await authenticate.admin(request);
//   const { shop } = session;
//   let myShop = shop.replace(".myshopify.com", "");
//   return myShop;
// };

// export default function Manage(props) {
//   const navigate = useNavigate();
//   const [setting, setSetting] = useState({});
//   const [openStates, setOpenStates] = useState({});
//   const [defaultSetting, setdefaultSetting] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [partnerType, setpartnerType] = useState("");
//   const [progress, setProgress] = useState(true);
//   const [save, setSave] = useState(false);
//   const [active, setActive] = useState(false);
//   const [modelUrl, setModelUrl] = useState("");
//   const [exitpop, setExitpop] = useState(false);
//   const toggleActive = useCallback(() => setActive((active) => !active), []);
//   const {defSetting, setDefSetting, progress2} = useOutletContext();

// const handleActionPlan = async (setloading,name) => {
//   setloading(true);
//   const data = {name:name}
//   const content = await InstallMetafields('/app/plan', data);
//   // const content = await graphql_billing({data});
//   // console.log("contentPlan", content);
//   window.open(content.data, '_top');
// }

// useEffect(() => {
//   setProgress(progress2);
// }, [progress2]);

// useEffect(() => {
//   setSetting(defSetting);
//   setpartnerType(defSetting.plan_name);
//   setdefaultSetting(defSetting);
// }, [defSetting]);

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
//       setActive(shopify.toast.show(responseJson.statusText, {
//           duration: 3000,
//         })
//       );
//     }
//   } catch (error) {
//     console.error("An error occurred:", error.message);
//   } finally {
//     setLoading(false);
//     setSave(false);
//   }
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

// const selectChange = (val, name, pername, category = null) => {
//   setSetting((preValue) => {
//     let newFormValues = { ...preValue };

//     if (category) {
//       newFormValues[category] = {
//         ...newFormValues[category],
//         [name]: val,
//       };
//     } else if (pername) {
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

// const settingsList = [
//   { key: "app_status", label: "App Status", content: "Enable this for the app functioning on the account page." },
//   { key: "message_position", label: "Success message display position", content: "" },
// ];

// const appStatusSettings = settingsList.filter(item => item.key === 'app_status');
// const messagePositionSettings = settingsList.filter(item => item.key === 'message_position');


// const matchedStyle = successMessageDisplayPosition.find(
//   (style) => style.value === setting?.message_position
// );

// const selectChange3 = (name, value) => {
//   setSetting((prev) => {
//     const newFormValues = { ...prev, [name]: value };
//     setSave(prevSave => JSON.stringify(defaultSetting) !== JSON.stringify(newFormValues));
//     return newFormValues;
//   });
// };

// const suffixStyles = {
//   minWidth: '24px',
//   textAlign: 'right',
// };

// const closePopup = () => {
//   // console.log("defaultSetting",defaultSetting);
//   setSetting(prev => ({ ...defaultSetting })); 
//   setSave(false);
// };

//     // return (
//     //     <>
//     //     <Page
//     //     backAction={{ onAction: ClickEvent }}
//     //     title="Prevent fake signups"
//     //     // primaryAction={{
//     //     //     content: "Go to Settings",
//     //     //     onAction: goToSettings
//     //     // }}
//     //     >
//     //     {/* Page content here */}
//     //     </Page>
//     //     </>
//     // );

//     const ClickEvent = () => {
//       window.open("shopify://admin/apps/email-checkr/app", "_self");
//     };
    
//     return (
//       <>
//         <SaveBar id="my-save-bar" open={ save }>
//           <button variant="primary" onClick={()=> submit()} disabled={loading}></button>
//           <button onClick={()=> closePopup()}></button>
//         </SaveBar>
//       {
//         progress ?
//           <SkeletonExample /> :
//         <div>
//         <Page title='Prevent fake signups' backAction={{ onAction: ClickEvent }}>
//           <Layout >
//           {/* {
//             appStatusSettings.map((item) => (
//               <Layout.AnnotatedSection
//                 id={item.key}
//                 title={item.label}
//                 description={item.content}
//                 key={item.key}
//               >
//                 <Card>
//                   <ChoiceList
//                     choices={[
//                       { label: 'Active', value: true },
//                       { label: 'Deactive', value: false }
//                     ]}
//                     selected={[setting?.[item.key] ?? true]} // Ensuring it's always an array
//                     onChange={(value) => {
//                       console.log(`Updating ${item.key} to`, value[0]); // Debug log
//                       selectChange3(item.key, value[0]); // Pass the selected value directly
//                     }}
//                   />
//                 </Card>
//               </Layout.AnnotatedSection>
//             ))
//           } */}

//           {
//             messagePositionSettings.map((item,key) => (
//             <Layout.AnnotatedSection
//               id="message_position"
//               title={item.label}
//               description={item.content}
//             >
//           {/* <Card>
//             <ChoiceList
//               title=""
//               choices={successMessageDisplayPosition.map((style) => ({
//                 label: style.title,
//                 value: style.value
//               }))}
//               selected={[setting?.[item.key] ?? successMessageDisplayPosition[0].value]} 
//               onChange={(value) => {
//                 console.log(`Updating ${setting?.[item.key]} to`, value[0]);
//                 selectChange3([item.key], value[0]);
//               }}
//             />
//           </Card> */}
//               <Card>
//               <Box paddingBlockEnd={400} key={key}>
//               <BlockStack>
//   {successMessageDisplayPosition.map((style) => (
//     <InlineStack key={style.value} align="baseline" blockAlign="center">
//       <RadioButton
//         label={style.title}
//         checked={(setting?.[item.key] ?? successMessageDisplayPosition[0].value) === style.value}
//         id={style.value}
//         name="successPosition"
//         onChange={() => selectChange3([item.key], style.value)}
//       />
//       <Tooltip content="Position">
//         <Button
//           onClick={() => {
//             setModelUrl(style?.image || "");
//             setExitpop(true);
//           }}
//           variant="plain"
//         >
//           <Icon source={AlertCircleIcon} tone="base" />
//         </Button>
//       </Tooltip>
//     </InlineStack>
//   ))}
// </BlockStack>

//                 </Box>
//               </Card>

//               <Modal open={exitpop} onClose={() => setExitpop(false)}>
//                 <TitleBar title="Preview" />
//                 <Box padding="200" display="flex" alignItems="center" justifyContent="center">
//                   <img
//                     className="cus_prew_img"
//                     src={modelUrl}
//                     alt="Preview"
//                     style={{
//                       maxWidth: "100%",
//                       maxHeight: "80vh",
//                       objectFit: "contain",
//                       display: "block",
//                       margin: "0 auto"
//                     }}
//                   />
//                 </Box>
//               </Modal>
//             </Layout.AnnotatedSection>
//             ))
//           }

//             <Layout.AnnotatedSection
//               id="coloroptions"
//               title="Color options"
//               description="Easily customize your design by selecting a new color from the palette to update your settings."
//             >
//             <Card>
//               {[
//                 {
//                   key: "main_heading_color",
//                   name: "Main heading color",
//                   value: setting.main_heading_color,
//                 },
//                 {
//                   key: "success_message_color",
//                   name: "Success message text color",
//                   value: setting.success_message_color,
//                 },
//               ].map((ele, index) => (
//                 <Box
//                   key={index}
//                   padding="100"
//                   // borderColor="border-secondary"
//                   // borderStyle="solid"
//                   // borderInlineEndWidth="025"
//                   // borderInlineStartWidth="025"
//                   // borderBlockStartWidth="025"
//                 >
                                      
//                   <InlineGrid  alignItems="end">
//                     {/* Color Setting Label */}
//                     <Text variant="bodyMd" as="p">{ele.name}</Text>
//                     <Box
//                       padding="100"
//                       borderWidth="025"
//                       borderStyle="solid"
//                       borderColor="black"
//                       borderRadius="100"
//                       paddingBlockStart="100"
//                       // paddingBlockEnd="100"
//                     >
//                     <InlineStack align='' blockAlign='center'>
//                     <Box paddingInlineEnd="100">
//                     <PopoverSetting
//                       cd_title={ele.key}
//                       ColorChange={handleColorSetting}
//                       value={ele.value}
//                     />
//                     </Box>
//                     <Text variant="bodyMd" as="p">{ele.value}</Text>
//                     </InlineStack>
//                     </Box>
//                   </InlineGrid>
//                 </Box>
//               ))}
//               <Divider />
//             </Card>
//             </Layout.AnnotatedSection>

//             <Layout.AnnotatedSection
//               id="typography"
//               title="Typography"
//               description="Quickly adjust your typography by choosing a new font style to match your preferences."
//             >
//             <Card >
//               <RangeSlider
//                 label="Main heading font size"
//                 value={setting.typography?.main_heading_font_size || ""}
//                 name="main_heading_font_size"
//                 min={10}
//                 max={60}
//                 onChange={(e) => selectChange(e, 'main_heading_font_size', null, "typography")}
//                 suffix={<p style={suffixStyles}>{setting?.typography?.main_heading_font_size}px</p>}
//                 output
//               />
//               <RangeSlider
//                 label="Success message font size"
//                 name="success_message_font_size"
//                 value={setting.typography?.success_message_font_size || ""}
//                 min={10}
//                 max={60}
//                 onChange={(e) => selectChange(e, 'success_message_font_size', null, "typography")}
//                 suffix={<p style={suffixStyles}>{setting?.typography?.success_message_font_size}px</p>}
//                 output
//               />
//               <RangeSlider
//                 label="Error message font size"
//                 name="error_message_font_size"
//                 value={setting.typography?.error_message_font_size || ""}
//                 min={10}
//                 max={60}
//                 onChange={(e) => selectChange(e, 'error_message_font_size',  null, "typography")}
//                 suffix={<p style={suffixStyles}>{setting?.typography?.error_message_font_size}px</p>}
//                 output
//               />
//             </Card>
//             </Layout.AnnotatedSection>
    
//             <Layout.AnnotatedSection
//               id="custom_css"
//               title="Custom CSS"
//               description="Personalize your design by adding custom CSS to fine-tune the look and feel."
//             >
//             <Card >
//             <TextField
//               placeholder='.style{...}'
//               multiline={8}
//               autoComplete="off"
//               value={setting?.custom_css}
//               name="custom_css"
//               onChange={(e) => selectChange(e, 'custom_css')}
//             />
//             </Card>
    
//             </Layout.AnnotatedSection>
//           </Layout>
//           <Footer /> 
//         </Page>
//         </div>
//       }
//       </>
//       )

//   }

import { useLocation, useNavigate, useOutletContext, useSearchParams } from "@remix-run/react";
import RegistrationSetup from "./Feature components/RegistrationSetup";
import { BlockStack, Box, Button, ButtonGroup, Card, InlineStack, Layout, MediaCard, Modal, Page, Text, VideoThumbnail } from "@shopify/polaris";
import HelpSupport from "../components/HelpSupport";
import { useCallback, useEffect, useState } from "react";
import { SaveBar, TitleBar } from "@shopify/app-bridge-react";
import ReactPlayer from "react-player";


const PreventFakeSignups = () => {
  const [save, setSave] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [modelFirst, setModelFirst] = useState(false);
  const view = searchParams.get("view");
  const [setting, setSetting] = useState({});
  const [defaultSetting, setdefaultSetting] = useState({});
  const [progress, setProgress] = useState(true);
  const [loading, setLoading] = useState(false);
  const [partnerType, setpartnerType] = useState("");
  const [active, setActive] = useState(false);
  const toggleActive = useCallback(() => setActive((active) => !active), []);
  const { defSetting, setDefSetting, progress2 } = useOutletContext();

  const handleChangeView = (view) => {
    navigate(`?view=${view}`, { replace: true });
  };

  const handleBack = () => {
    const pathname = window.location.pathname;
    const search = window.location.search;

  
    if (pathname.includes("prevent_fake_signups") && search) {
      navigate("/app/features/prevent_fake_signups", { replace: true });
    } else if (pathname.includes("prevent_fake_signups")) {
      navigate("/app/features", { replace: true });
    } else {
      navigate(-1);
    }
  };

  const backActionButton = (save, fallbackUrl) => {
    const navigate = useNavigate();
  
    const handleAction = () => {
      const pathname = window.location.pathname;
      const search = window.location.search;
  
      if (save) {
        window.open("shopify://admin/apps", "_self");
        return;
      }
  
      if (pathname.includes("prevent_fake_signups") && search) {
        navigate("/app/features/prevent_fake_signups", { replace: true });
      } else if (pathname.includes("prevent_fake_signups")) {
        navigate("/app/features", { replace: true });
      } else if (fallbackUrl) {
        navigate(fallbackUrl, { replace: true });
      } else {
        navigate(-1);
      }
    };
  
    return { content: "Back", onAction: handleAction };
  };
  
  const closePopup = () => {
    setSetting((prev) => ({ ...defaultSetting }));
    setSave(false);
  };

  const ClickEvent = () => {
    window.open("shopify://admin/apps/email-checkr/app", "_self");
  };

useEffect(() => {
  setProgress(progress2);
}, [progress2]);


useEffect(() => {
  setSetting(defSetting);
  setpartnerType(defSetting?.plan_name);
  setdefaultSetting(defSetting);
}, [defSetting]);

const submit = async () => {
  let formdata = new FormData();
  formdata.append("_action", "POST_METAFIELD");
  formdata.append("_postMetafileds", JSON.stringify(setting));
  setLoading(true);
  try {
    const response = await fetch("/app/translation", {
      method: "POST",
      body: formdata,
    });
    const responseJson = await response.json();
    setDefSetting(setting);
    if (response.status === 200) {
      setActive(
        shopify.toast.show(responseJson.statusText, {
          duration: 3000,
        }),
      );
    }
  } catch (error) {
    console.error("An error occurred:", error.message);
  } finally {
    setLoading(false);
    setSave(false);
  }
};

  return (
    <>
        <SaveBar id="my-save-bar" open={ save }>
          <button variant="primary" onClick={()=> submit()} disabled={loading}></button>
          <button onClick={()=> closePopup()}></button>
        </SaveBar>
    <Page
      title="Prevent Fake Signups"
      backAction={backActionButton(save, "/app/features")}
    >
        {view ? (
          view === "registration" && <RegistrationSetup setSave={setSave} defSetting={defSetting} setDefSetting={setDefSetting} setting={setting} setSetting={setSetting} defaultSetting={defaultSetting} setdefaultSetting={setdefaultSetting} progress2={progress2} />
        ) : (
      <Layout>
        <Layout.Section>
        <Card roundedAbove="sm">
      <BlockStack gap="500">
        <BlockStack gap="200">
          <Text as="h2" variant="headingSm">
          Secure your account with email activation
          </Text>
          <Text as="p" variant="bodyMd">
          Email Checkr adds a layer of protection by requiring email activation during sign-up. 
          This ensures that only users with valid and accessible email addresses can complete registration, 
          helping to keep your platform secure and free from fake signups.
          </Text>
        </BlockStack>
        <InlineStack align="start">
          <ButtonGroup>
            <Button
              onClick={() => handleChangeView("registration")}
              accessibilityLabel="Registration page setup"
            >
              Registration page setup
            </Button>
          </ButtonGroup>
        </InlineStack>
      </BlockStack>
    </Card>
        </Layout.Section>

        <Layout.Section>
              <Card>
                <Box paddingBlockEnd={400}>
              <Text as="h2" variant="headingMd">
                Setup Guide
              </Text>
              </Box>
              <MediaCard
            title="Turn your side-project into a business"
            primaryAction={{
              content: 'Learn more',
              onAction: () => setModelFirst(true),
            }}
            description={`In this course, you’ll learn how the Kular family turned their mom’s recipe book into a global business.`}
            popoverActions={[{content: 'Dismiss', onAction: () => {}}]}
          >
            <VideoThumbnail
              videoLength={80}
              thumbnailUrl="https://mandasa1.b-cdn.net/emailcheckr/email%20checker%20installation.mp4"
              onClick={() => setModelFirst(true)}
            />
            <Modal
                open={modelFirst}
                onClose={() => setModelFirst(false)}
            >
                {/* <TitleBar title='Installation process' /> */}
                <Box padding={200}>
                    <ReactPlayer url='https://mandasa1.b-cdn.net/emailcheckr/email%20checker%20installation.mp4' width="100%" height="360px" controls={true} />
                </Box>
            </Modal>
          </MediaCard>
          </Card>
        </Layout.Section>

        <HelpSupport />
      </Layout>
  )}

    </Page>
    </>
  );
};

export default PreventFakeSignups;
