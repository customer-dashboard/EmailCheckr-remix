
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { GetCollectionMongoDB } from "../server/mongodb";
// import { getSubscriptionsFrontEnd } from "../models/actions.server";
// import { restRequest } from "../shopify.server";
import {  postProfileData, checkCustomerEmailAdmin, getSettings, postMetafileds, checkLocal, getCountryFromIp } from "../Modals/Grapql";


export const loader = async ({ request }) => {
  let { searchParams } = new URL(request.url);
  let shop = searchParams.get("shop");
  const users = await GetCollectionMongoDB("shopify_sessions",shop);
  const sessionArray = JSON.parse(users);
  const accessToken = sessionArray.accessToken;
  let variables = {};



  // const subscription = await getSubscriptionsFrontEnd();
  // const all_metafield_with_namespace = await graphQLRequest({ shop: shop, accessToken, query: getAllShopMetafieldsQueryFrontend, variables, });
  // const CustomerCount = await restRequest({shop: shop, accessToken, path: "customers/count.json"});
  // const Subscriptionplan = await graphQLRequest({ shop: shop, accessToken, query: subscription, variables:{} });
  // const data = {shop: shop, CustomerCount: CustomerCount, subscription:Subscriptionplan };
  // const data = {shop: shop, data: all_metafield_with_namespace.shop.metafields.edges, CustomerCount: CustomerCount };
  return json(shop);
};

export const action = async ({ request }) => {
  const reqbody = await request.json();
  // console.log("reqbody", reqbody);
  let { searchParams } = new URL(request.url);
  let _actions = reqbody.target;
  let shop = searchParams.get("shop");
  // console.log("query", typeof(shop));
  // let customerID = reqbody.localCustomerID;
  // let stringCustomerID = JSON.stringify(customerID);
  const users = await GetCollectionMongoDB("shopify_sessions",shop);
  const { admin, session } = await authenticate.public.appProxy(request);
  // console.log("session", session);
  // console.log("admin", admin);
  // console.log("users", users);
  const sessionArray = JSON.parse(users);
  const accessToken = sessionArray.accessToken;
  var setting = await getSettings(admin);
  setting = JSON.parse(setting);
  // console.log(setting.translation,"trans");
  // const getbilling = async (session) => {
  //   let plans = Object.keys(billingConfig);
  //   for (let index = 0; index < plans.length; index++) {
  //     const element = plans[index];
  //     console.log("element", element);
  //     const hasPayment = await hasBillingCheck(session, billing);
  //     if (hasPayment.hasActivePayment) {
  //       let array = {};
  //       array.id = hasPayment.appSubscriptions[0].id;
  //       array.name = hasPayment.appSubscriptions[0].name;
  //       array.status = "active";
  //       array.check = 200;
  //       return array;
  // }
  // }
  // return { check: 200 };
  // };

  
  const postCheckBilling = async (session, setting) => {
    // let billing = [];
    // billing = await getbilling(session, billing);
    // console.log("billing", billing);
    if (( setting.app_status === true)) {
      return true;
    }
    setting.app_status = false;
    let formdata = new FormData();
    formdata.append("_postMetafileds", JSON.stringify(setting));
    const postData = await postMetafileds(admin,formdata,shop,accessToken);
    return false;
  };

  const ReturnProfileSection = async(session,setting,reqbody)=>{
    let check = await checkLocal(admin, session, reqbody.local);
    let language = "english";
    check.forEach(
      (check_locale) => (language = check_locale.name.toLowerCase())
    );
    // console.log(setting.translation[language],"language in profile");
    setting.translation[language][
      "we_have_sent_an_email_to_[EMAIL]_please_click_the_link_included_to_verify_your_email_address"
    ] = setting.translation[language][
      "we_have_sent_an_email_to_[EMAIL]_please_click_the_link_included_to_verify_your_email_address"
    ].replace("[EMAIL]", reqbody.email);
    var main_heading = `
    <div class="cav_main_content" style="margin-bottom:10px">
      <h4 class="cav_heading" style="color:${setting.main_heading_color}; font-size: ${setting.typography.main_heading_font_size}px; text-align: left; padding-left: 58px;">
        ${setting.translation[language].please_adjust_the_following}
      </h4>
      <ul class="cav_content" style="margin:15px">
        <li style="color:${setting.success_message_color}; font-size: ${setting.typography.success_message_font_size}px;">
          ${setting.translation[language]["we_have_sent_an_email_to_[EMAIL]_please_click_the_link_included_to_verify_your_email_address"]}
        </li>
      </ul>
    </div>`;
    // console.log("trans", setting.translation[language]["this_email_has_already_been_used_for_registration!"]);
    if (setting.translation[language] && setting.translation[language].hasOwnProperty("this_email_has_already_been_used_for_registration!")) {
      var error_message = `<p style="font-size: ${setting.typography.error_message_font_size}px;">${setting.translation[language]["this_email_has_already_been_used_for_registration!"]}</p>`;
    } else {
      var error_message = `<p>This email has already been used for registration!</p>`;
    }
    
    
     return {
      getemail: main_heading,
      error_msg: error_message,
      position: setting.message_position,
      css: setting.custom_css,
    };
  }
  
  switch (_actions) {
    
  case "check_billing":
    const check_billing = await postCheckBilling(session,setting);
    console.log("check_billing", check_billing);
    return json(check_billing);

  case "get_customer_metafield":
    const res = await getSettings(admin);
    const metafield = res?.get_account_validation_status;
    const metafieldsData = { shop: shop, data: metafield, message: "successfully_get", status: 200 };
    return json(metafieldsData);

  case "get_country":
    
    // console.log("shopify", shopify);
    const ip = request.headers.get("x-forwarded-for") || "your fallback IP";
    const singleIp = ip.split(',')[0];
    console.log("ip in postApi", singleIp);
    const country = await getCountryFromIp(singleIp); 
    const countries = await GetCollectionMongoDB('fraud_filter_blocker',shop);
    const parsed = typeof countries === 'string' ? JSON.parse(countries) : countries;
    const blockedCountries = parsed.blocked_countries;
    console.log("blockedCountries", blockedCountries);
    const country_blocker_status = parsed.country_blocker_status;
    console.log("country_blocker_status", country_blocker_status);
    if(country_blocker_status == 'enable'){
    if (blockedCountries.includes(country)) {
    console.log("Access Denied!");
    return new Response("Access Denied", { status: 403 });
  }
}

  case "profile-data":
    try {
      const checkMail = await checkCustomerEmailAdmin(shop, reqbody, accessToken);
      // console.log("checkMail", checkMail);
    
      // If the email exists, return 
      if (checkMail.customers && checkMail.customers.length > 0) {
        console.log("Email exists");
        let data = await ReturnProfileSection(session,setting,reqbody);
        const profile_data = { shop: shop, data: data, message: "This email has already been used for registration!", status: 500 };
        return json(profile_data);
      }
    
      // console.log("Email not found");
      await postProfileData(shop, reqbody, accessToken);
      let data = await ReturnProfileSection(session,setting,reqbody);
      const profile_data = { shop: shop, data: data, message: "successfully_get", status: 200 };
      // console.log("profile_data", profile_data);
      return json(profile_data);
    
    } catch (error) {
      console.error("Error handling profile_data:", error.message);
      return json({ error: error.message, status: 500 });
    }
  
      default:
      break;
  }
  return json({ message: true });
};
