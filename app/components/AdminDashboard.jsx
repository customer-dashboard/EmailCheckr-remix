import React, { useEffect } from "react";
import {
  Button, Layout, Page, Toast, ResourceList, TextField, Frame, Badge, Collapsible,
  Banner, Text, ProgressBar,
  Card,
  Grid,
  Box,
  InlineStack
} from "@shopify/polaris";
import "./style.css";
import { useState, useCallback } from "react";
import { useNavigate, useOutletContext } from 'react-router-dom'
import Above_form from "../assets/image/Above_form.png"
import Before_submit from "../assets/image/Before_submit.png"
import Below_submit from "../assets/image/Below_submit.png"
import { Footer } from './footer'
import PopoverSetting from './Popover'
import SkeletonExample from './SkeletonExample';
import { SaveBar, TitleBar, useAppBridge } from "@shopify/app-bridge-react";



const AdminDashboard = (props) => {
  const { shop } = props;
  const myShop = shop.replace(".myshopify.com", "");
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
  const [editToggle, setEditToggle] = useState(true);
  const [active, setActive] = useState(false);
  const toggleActive = useCallback(() => setActive((active) => !active), []);

  const getbilling = async() =>{
    let formdata = new FormData();
    formdata.append("_action", "get_billing");
    const response = await fetch("/app/emailCh-api", {method: "POST", body: formdata});
    const responseJson = await response.json();
    if(responseJson.status==200) {
    //  setPaymentcheck(responseJson?.data)
    }
}
  const customerStatus = async() =>{
    let formdata = new FormData();
    formdata.append("_action", "get_customer_status");
    const response = await fetch("/app/emailCh-api", {method: "POST", body: formdata});
    const responseJson = await response.json();
    console.log("customerStatus", responseJson);
    if(responseJson.status==200) {
    }
}

  const paymentCheck = async() =>{
    let formdata = new FormData();
    formdata.append("_action", "has_payment_check");
    const response = await fetch("/app/emailCh-api", {method: "POST", body: formdata});
    const responseJson = await response.json();
    console.log("paymentCheckshop",responseJson.shop);
    return (responseJson);
}
      // const charge_id = 34744303890;
  useEffect(() => {
    const fetchData = async () => {
      const queryParameters = new URLSearchParams(window.location.search);
      const charge_id = queryParameters.get("charge_id");
      console.log("charge_id", charge_id);
  
      if (charge_id) {
        await getbilling();
        await customerStatus();
        const data = await paymentCheck();
        console.log('dataShop', data.shop);
        const shop = data.shop.replace(".myshopify.com", "");
        window.open(
          "https://admin.shopify.com/store/" + shop + "/apps/customer-account-verification",
          "_top"
        );
      }
      await getSettings();
    };
    fetchData();
  }, []);

  useEffect(() => {
      getSettings();
  }, []);

  const closePopup = () => {
    setSetting({ ...defaultSetting });
    setSave(false)
  }

   const getSettings = async () => {
      console.log("here");
    let formdata = new FormData();
    formdata.append("_action", "get_account_validation_status");
    try {
      const response = await fetch("/app/translation", {
        method: "POST",
        body: formdata,
      });
      const responceJson = await response.json();
      console.log("responceJson", responceJson);
      const content_ = responceJson.get_account_validation_status;
      const content = JSON.parse(content_);
      console.log("content", content);
      setSetting(content);
      setpartnerType(content.plan_name);
      setdefaultSetting(content);
      setProgress(false);
    } catch (error) {
      console.error("An error occurred:", error.message);
    } 
  }
// console.log("defaultSetting", defaultSetting);

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
      console.log("content",responseJson);
      console.log("content.data",responseJson.statusText);
      if (response.status === 200) {
        setActive(<Toast content={responseJson.statusText} onDismiss={toggleActive} />);
      }
    } catch (error) {
      console.error("An error occurred:", error.message);
    } finally {
      setLoading(false);
      setSave(false);
      setEditToggle(false);
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

  const cardData = [
    { title: "Invited", color: "primary", content: "View", persantage: persantage(setting?.segment?.invited, setting?.segment?.count), value: setting?.segment?.invited, url: `https://admin.shopify.com/store/${myShop}/customers/segments/${setting?.segment?.id?.invited?.replace("gid://shopify/Segment/", "")}` },
    { title: "Enabled", color: "success", content: "View", persantage: persantage(setting?.segment?.enabled, setting?.segment?.count), value: setting?.segment?.enabled, url: `https://admin.shopify.com/store/${myShop}/customers/segments/${setting?.segment?.id?.enabled?.replace("gid://shopify/Segment/", "")}` },
    { title: "Disabled", color: "critical", content: "View", persantage: persantage(setting?.segment?.disabled, setting?.segment?.count), value: setting?.segment?.disabled, url: `https://admin.shopify.com/store/${myShop}/customers/segments/${setting?.segment?.id?.disabled?.replace("gid://shopify/Segment/", "")}` },
  ]

  const handleActionPlan = async (setloading,name) => {
    setloading(true);
    const data = {name:name}
    const content = await InstallMetafields('/app/plan', data);
    // const content = await graphql_billing({data});
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
    selectChange(Object.values(e)[0], Object.keys(e)[0]);
  }

  const selectChange = (val, name, pername) => {
    if (defaultSetting[name] === val) setSave(false);
    else setSave(true);
    setSetting((preValue) => {
      let newFormValues = { ...preValue };
      pername ? newFormValues.translation[pername][name] = val : newFormValues[name] = val
      return newFormValues;
    })
  }
  

  const successMessageDisplayPosition = [
    { title: "Before Form", image: Above_form, value: "beforeBegin", description: "This will make the navigation slide like." },
    { title: "Before Submit Button", image: Before_submit, value: "middle", description: "This will make the navigation slide like." },
    { title: "After Submit Button", image: Below_submit, value: "beforeEnd", description: "This will make the navigation toggle like." },
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
        // style={{ display: "none" }}
        onClick={DeleteMetafields}>Delete Metafields</button>
      {
        progress ?
          <SkeletonExample /> :
        <div>
            <Page title='Dashboard'
              primaryAction={{ content: "Installation", onAction: () => navigate("/app/installation") }}
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
                <Layout.Section >
                  <Card>
                      <InlineStack align='space-between'>
                        <Box paddingBlockEnd='300'>
                            <Text as="h2" variant='headingMd'>App status</Text>
                        </Box>
                        {setting?.billing?.status === "active" ?<Button size='slim' onClick={() => selectChange(!setting.app_status, "app_status")}>{setting?.app_status ? "Active" : "Deactive"}</Button>:null}
                      </InlineStack>
                      {<p>EmailCheckr app currently is set to <Badge tone={setting?.app_status ? "success" : "critical"}>{setting?.app_status ? "Active" : "Deactive"}</Badge></p>}
                  </Card>
                </Layout.Section>
                <Layout.Section fullWidth >
                  <div className="app_plan border">
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
                    {/* </LegacyCard.Section> */}
                    <Box paddingBlockStart="200">
                      <Text>${partnerType=="enterprise"?9.99:2.99} USD/Month{setting?.billing?.status === "active" ? '' : " ( 7-Days free trial )"}</Text>
                    </Box>
                  {/* </LegacyCard> */}
                  </Card>
                  </div>
                </Layout.Section>
              
                { 
               setting?.segment?.id?
                <Layout.Section>
                  <Grid>
                      {cardData.map((ele, index) => (
                          <Grid.Cell key={index} columnSpan={{xs: 6, sm: 3, md: 3, lg: 4, xl: 4}}>
                              <Card>
                            <Text as='h2' variant='headingMd'>{ele.title}</Text>
                            <Box paddingBlockEnd='300' paddingBlockStart='300'>
                            <InlineStack align='space-between' blockAlign='center'>
                            <Text as='h2' variant='headingMd'>{`${ele.value} ${ele.value > 1 ? "Customers" : "Customer"}`}</Text>
                            <Button url={ele.url}>View</Button>
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
                          <Grid.Cell columnSpan={{xs: 4, sm: 3, md: 3, lg: 4, xl: 4}}>
                             <div className={setting?.message_position === style.value ? 'selected_position' : 'not_selected'}>
                              {/* <MediaCard
                                portrait
                                // primaryAction={{
                                //   content: `${style.title}`,
                                //   onAction: () => selectChange(style.value, 'message_position'),
                                // }}
                              >
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
                              </MediaCard> */}
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
                              </div>
                              </Grid.Cell>
                          ))
                        }
                 </Grid>
                 </Card>
                </Layout.Section>

                <Layout.Section>
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
                          <Collapsible
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
                </Layout.Section>

                <Layout.Section>
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
                </Layout.Section>

                <Layout.Section>
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
                </Layout.Section>
              </Layout>
              {active}
              <Footer /> 
              {/* </Layout> */}
            </Page>
            </div>
      }
    </Frame>
  );
};

export default AdminDashboard;
