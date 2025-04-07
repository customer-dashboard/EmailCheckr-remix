import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import { authenticate } from "../shopify.server";
import { Links, LiveReload, Meta, Scripts } from '@remix-run/react';
import { useEffect, useState } from "react";
import { json } from '@remix-run/node';
import { getSettings } from "../Modals/Grapql";
// import "@shopify/polaris-viz/build/esm/styles.css";

//https://my-public-app.myshopify.com/apps/test-app
export const links = () => [{ rel: "stylesheet", href: polarisStyles }];


export const loader = async ({ request }) => {
  const session = await authenticate.admin(request);
  if (!session) {
    throw new Response("Unauthorized", { status: 401 });
  }

  return json({
    apiKey: process.env.SHOPIFY_API_KEY || "",
  });
};

export default function App() {
  const { apiKey } = useLoaderData();
  const [customerstatus, setCustomerStatus] = useState([]);
  const [storelanguages, setStorelanguages] = useState([]);
  const [allthemes, setAllThemes] = useState([]);
  const [defSetting, setDefSetting] = useState([]);
  const [progress2, setProgress2] = useState(true);
  var count = 0;

  useEffect(() => {
    if (count==0) {
    setMetafields();
    // Database();
    get_AllSettings();
    count=1;
  }
  }, []);
  
  useEffect(()=>{
    // if (count==0) {
      getLocals();
      getThemes();
      Database();
      // forCheck();
      customerStatus();
    //   count=1;
    // }
  },[])
  
  useEffect(() => {
    const fetchData = async () => {
      const queryParameters = new URLSearchParams(window.location.search);
      const charge_id = queryParameters.get("charge_id");
      // console.log("charge_id", charge_id);
      if (charge_id) {
        // setProgress2(true);
        const data = await paymentCheck();
        await getbilling();
        await customerStatus();
        let newShop = data.replace(".myshopify.com", "");
        window.open(
          "https://admin.shopify.com/store/" + newShop + "/apps/email-checkr",
          "_top"
        );
      }else{
        get_AllSettings();
      }
      await get_AllSettings();
    };
    fetchData();
  }, []);

  const getLocals = async() =>{
    let formdata = new FormData();
      formdata.append("_action", "GET_LOCALS");
      try {
        const response = await fetch("/app/translation", {
          method: "POST",
          body: formdata,
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseJson = await response.json();
        if(responseJson.status==200) {
          const { locals } = responseJson.data;
          // console.log("locals", locals);
          setStorelanguages(locals?.shopLocales);
        }
      } catch (error) {
        console.error("An error occurred:", error.message);
      }
  }

  const getThemes = async() =>{
    let formdata = new FormData();
      formdata.append("_action", "GET_THEMES");
      try {
        const response = await fetch("/app/translation", {
          method: "POST",
          body: formdata,
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseJson = await response.json();
        if(responseJson.status==200) {
          const { themes } = responseJson.data;
          const allThemes = themes.themes.edges;
          setAllThemes(allThemes);
        }
      } catch (error) {
        console.error("An error occurred:", error.message);
      }
  }

  const get_AllSettings = async () => {
    let formdata = new FormData();
    formdata.append("_action", "get_account_validation_status");
    try {
    const response = await fetch("/app/emailCh-api", {method: "POST", body: formdata});
    const responseJson = await response.json();
    const content_ = responseJson?.get_account_validation_status;
    const content = JSON.parse(content_);
    // console.log("get_account_validation_status", content);
    if (content === null) {
      setProgress2(true);
      setTimeout(() => {
       get_AllSettings();
      }, 100); 
    } else {
      setDefSetting(content);
      setProgress2(false);
    }
        } catch (error) {
      console.error("An error occurred:", error.message);
    } 
  }
  
  // const get_AllSettings = async () => {
  //   console.log("getAll setting")
  //   let data = [];
      // data = await getMetafileds();
      // data.plan_name = await shopify.api.rest.Shop.all({session: session,fields:"plan_name"});
      // data.plan_name = data.plan_name.data[0].plan_name;
      // data.billing = await getbilling();
      // data.segment = await getSegment();
      // console.log("get_account_validation_status", data);

    // const response = data;
    // const responseJson = await response.json();
    // const content_ = responseJson?.get_account_validation_status;
    // const content = JSON.parse(content_);
    // console.log("get_account_validation_status", data);
    // if (content === null) {
    //   setProgress2(true);
    //   setTimeout(() => {
    //    get_AllSettings();
    //   }, 100); 
    // } else {
    //   setDefSetting(content);
    //   setProgress2(false);
    // }
  // }

  async function Database() {
    try {
      // const data = await paymentCheck();
      // await getbilling();
      // await customerStatus();
      await getFaq();
      
      console.log("All functions executed successfully.");
    } catch (error) {
      console.error("Error in main function:", error);
    }
  }


  const setMetafields = async() =>{
    let formdata = new FormData();
    formdata.append("_action", "set_metafields");
    const response = await fetch("/app/emailCh-api", {method: "POST", body: formdata});
    const responseJson = await response.json();
    // console.log("responseJson", responseJson);
    // console.log("status", responseJson.status);
    if(responseJson.status!==200) {
      setMetafields();
    }
  } 

  const getFaq = async() =>{
    let formdata = new FormData();
    formdata.append("_action", "get_installation_faq");
    const response = await fetch("/app/emailCh-api", {method: "POST", body: formdata});
    const responseJson = await response.json();
    if(responseJson.status==200) {
    //  setPaymentcheck(responseJson?.data)
    }
}

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
  // console.log("customerStatus", responseJson);
  if(responseJson.status==200) {
  }
}

const paymentCheck = async() =>{
  let formdata = new FormData();
  formdata.append("_action", "has_payment_check");
  const response = await fetch("/app/emailCh-api", {method: "POST", body: formdata});
  const responseJson = await response.json();
  return (responseJson.shop);
}

const forCheck = async() =>{
  let formdata = new FormData();
  formdata.append("_action", "for_check");
  const response = await fetch("/app/emailCh-api", {method: "POST", body: formdata});
  const responseJson = await response.json();
  return (responseJson.shop);
}

const getSegment = async() =>{
  let formdata = new FormData();
  formdata.append("_action", "get_customer_segment");
  const response = await fetch("/app/emailCh-api", {method: "POST", body: formdata});
  const responseJson = await response.json();
  // console.log("get_customer_segment",responseJson);
  return (responseJson.shop);
}

  
  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <ui-nav-menu> 
        <Link to="/app" rel="home">Home</Link>
        <Link to="/app/translations">Translations</Link>
        <Link to="/app/installation">Installation</Link>
        <Link to="/app/partners">Partners</Link>
        <Link to="/app/settings">Settings</Link>
      </ui-nav-menu>
        <Outlet context={{allthemes, defSetting, setDefSetting, progress2}} />
        <Scripts />
    </AppProvider>
  );
}

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
