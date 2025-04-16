import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { app_Status, createSegment, getAppStatus, getCustomersData, getSettings, getShopData, hasBillingCheck, postMetafileds } from "../Modals/Grapql"; 
import { GetCollectionMongoDB, GetMongoData, InsertUpdateData, MongoDB } from "../server/mongodb";
import { CurrentDate } from "../server/apicontroller";
import setting_json from "../server/setting";
import { billingConfig } from "./billing";


export async function get__segment(admin,session,accessToken){
      if (!admin) {
        throw new Error("Admin API is not initialized.");
      }
    
      let data = [];
      let formattedData = [];
      let invited = 0;
      let enabled = 0;
      let disabled = 0;
      let id = null;
    
      try {
        id = await GetCollectionMongoDB("customer_invited",session.shop);
        id = JSON.parse(id);
        if (id == null) {
          return false;
        }
    
        let pageInfo;
        do {
          const state = null;
          let response = await getCustomersData(session.shop,accessToken,state);
          data = data.concat(response);
          pageInfo = response.pageInfo;
        } while (pageInfo?.nextPage);
        // for (const element of data) {
        //   // console.log("element", element);
        //   if (element.tags?.includes("EmailCheckrSubscriber")) {
        //     switch (element.state) {
        //       case "enabled":
        //         enabled++;
        //         break;
        //       case "disabled":
        //         disabled++;
        //         break;
        //       case "invited":
        //         invited++;
        //         break;
        //     }
        //   }
        // }
        let dateWiseData = {}; 
        let totalCustomers = 0; 
        
        for (const element of data) {
          if (element.tags?.includes("EmailCheckrSubscriber")) {
            totalCustomers++; 
            const createdAt = new Date(element.created_at).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            });
        
            if (!dateWiseData[createdAt]) {
              dateWiseData[createdAt] = { enabled: 0, disabled: 0, invited: 0 };
            }
        
            switch (element.state) {
              case "enabled":
                dateWiseData[createdAt].enabled++;
                break;
              case "disabled":
                dateWiseData[createdAt].disabled++;
                break;
              case "invited":
                dateWiseData[createdAt].invited++;
                break;
            }
          }
        }
        
        const sortedDateWiseData = Object.keys(dateWiseData)
          .sort((a, b) => new Date(a) - new Date(b))
          .map((date) => ({
            key: date,
            enabled: dateWiseData[date].enabled,
            disabled: dateWiseData[date].disabled,
            invited: dateWiseData[date].invited,
          }));
        
        formattedData = {
          id: id || null, 
          invited: sortedDateWiseData.reduce((sum, obj) => sum + obj.invited, 0),
          enabled: sortedDateWiseData.reduce((sum, obj) => sum + obj.enabled, 0),
          disabled: sortedDateWiseData.reduce((sum, obj) => sum + obj.disabled, 0),
          total: totalCustomers, 
          dateWiseData: sortedDateWiseData, 
        };
        
      } catch (error) {
        formattedData = error.message;
      }
      return formattedData;
}

export async function action({ request }) {
    const { admin, session, billing } = await authenticate.admin(request);
    // console.log('emailCh admin', admin);
    // console.log('emailCh session', session);
    let response = {status:200};
    let { shop, accessToken } = session;
  try {
    const data = await request.formData();
    const _action = data.get("_action");
    if (_action === "profile_create") {
      response = await ProfileCreate(admin, data);
    } 
    else if (_action === "has_payment_check") {
      const hasPayment = await hasBillingCheck(session, billing);
      if (hasPayment.hasActivePayment) {
        const resdata = {
          shop: session.shop,
          plan_subscription: CurrentDate(),
          cancel_subscription: 1,
        };
    // console.log("resdata", resdata);
    await MongoDB(resdata, "trialdays", 1);

        const segmentData = {};
        var charge = await getSettings(admin);
        charge = JSON.parse(charge);
        charge.app_status = true;
            let formdata = new FormData();
            formdata.append("_postMetafileds", JSON.stringify(charge));
            const postData = await postMetafileds(admin,formdata,shop,accessToken);
        segmentData.enabled = await createSegment('Customers with enabled status - EmailChekr App', 'ENABLED', shop, accessToken);

        segmentData.disabled = await createSegment('Customers with disabled status - EmailChekr App','DISABLED', shop, accessToken);

        segmentData.invited = await createSegment('Customers with account activation email sent - EmailChekr App','INVITED', shop, accessToken);
        // console.log("segmentData", segmentData);
        // console.log("shop==", shop);
        if(segmentData.enabled) { await InsertUpdateData(shop,segmentData,"customer_invited");}

        response = ({shop:session.shop});
      }
    }
    else if (_action === "set_metafields"){
        var newArray = [];
        var newData = await getSettings(admin);
        var new_data = JSON.parse(newData);
        // console.log("new_data1", new_data);
        if (!new_data)new_data = setting_json;
        newArray = Object.keys(setting_json).filter((key) => !Object.keys(new_data).some((key2) => key === key2));
        newArray.map(key => new_data[key] = setting_json[key]);
        // new_data = await postLocal(admin.graphql,new_data);
        // console.log("new_data", new_data);
        let formdata = new FormData();
        formdata.append("_postMetafileds", JSON.stringify(new_data));
        const postData = await postMetafileds(admin,formdata,shop,accessToken);
    }
    else if (_action === "get_installation_faq"){
        let data = [];
        let status = 200;
        try {
          data = await GetCollectionMongoDB("installation_faq");
        } catch (error) {
          status = 500;
          data = error.message;
        }
        return json({ data, status });
    }
    else if (_action === "get_billing"){
        let plans = Object.keys(billingConfig);
        for (let index = 0; index < plans.length; index++) {
          const element = plans[index];
          // console.log("element", element);
          const hasPayment = await hasBillingCheck(session, billing, element);
          if (hasPayment.hasActivePayment) {
          var new_data = await getSettings(admin);
          let data = JSON.parse(new_data);
          data.billing = {
            id: hasPayment.appSubscriptions[0].id,
            name: hasPayment.appSubscriptions[0].name,
            status: "active",
            check: 200
          };
          // console.log("get_billing", data);
          let formdata = new FormData();
          formdata.append("_postMetafileds", JSON.stringify(data));
          let postDa = await postMetafileds(admin, formdata, shop, accessToken);
            return data;
          }
        }
        return { check: 200 };
    }
    else if (_action === "get_customer_status"){
        let data = {};
        try {
            const invited = await getCustomersData(shop,accessToken, "invited");
            const enabled = await getCustomersData(shop,accessToken, "enabled");
            const disabled = await getCustomersData(shop,accessToken, "disabled");
            const count = await getCustomersData(shop,accessToken, "count");
            // data.id = await GetCollectionMongoDB("customer_invited");
            let customer_invited = await GetCollectionMongoDB("customer_invited",shop);
            data.id = JSON.parse(customer_invited);
            data.enabled = enabled.length;
            data.invited = invited.length;
            data.disabled = disabled.length;
            data.count = count;
            // console.log("wholeData", data);
            var new_data = await getSettings(admin);
            let parse_data = JSON.parse(new_data);
            // parse_data.segment = data;
            parse_data.segment = await get__segment(admin,session,accessToken);
            // console.log("THIS IS THE FINAL DATA", parse_data);
            let formdata = new FormData();
            formdata.append("_postMetafileds", JSON.stringify(parse_data));
            let postDa = await postMetafileds(admin, formdata, shop, accessToken);
              return parse_data;
            }
         catch (error) {
          data = error.message;
        }
        return json({data});
    }
    else if (_action === "get_account_validation_status"){
      const get_account_validation_status = await getSettings(admin);
      // console.log("get_account_validation_status", get_account_validation_status);
      return json({get_account_validation_status,status:200})
    }
    else if (_action === "app_status"){
      const allthemesStr = data.get("allthemes");
      let allthemesEC = [];
      try {
        allthemesEC = JSON.parse(allthemesStr); 
      } catch (e) {
        console.error("Invalid JSON in allthemes:", e);
      }
      const app_status = await getAppStatus(session,allthemesEC);
      // console.log("App status", app_status);
      return json({app_status,status:200})
    }
    else if (_action === "get_shop_data"){
      // console.log("for check");
      const responce = await getShopData(admin,session);
      // console.log("get_shop_data", responce);
      return json({responce,status:200});
    }
    else if (_action === "for_check"){
      // console.log("for check");
      const responce = await get__segment(admin,session,accessToken);
      // console.log("responceForcheck", responce);
    }

  } catch (error) {
    console.error("Error in action:", error);
    response = {
      message: error.message,
      status: 500, 
    };
  }
  return json(response);
}

