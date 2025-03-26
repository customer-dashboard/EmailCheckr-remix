import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { createSegment, getbilling, getCustomersData, getSettings, getStoreLanguages, hasBillingCheck, hasBillingRequest, postLocal, postMetafileds } from "../Modals/Grapql"; 
import { GetCollectionMongoDB, GetMongoData, InsertUpdateData, MongoDB } from "../server/mongodb";
import { CurrentDate } from "../server/apicontroller";
import setting_json from "../server/setting";
import { billingConfig } from "./billing";

// export function dateDiffInDays(a, b) {
//     const _MS_PER_DAY = 1000 * 60 * 60 * 24;
//     const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
//     const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  
//     return Math.floor((utc2 - utc1) / _MS_PER_DAY);
//   }

export async function get__segment(admin,session,accessToken){
      // console.log("get_customer_segment");
      if (!admin) {
        throw new Error("Admin API is not initialized.");
      }
    
      let data = [];
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
    // console.log("responce", response);
          data = data.concat(response);
          // console.log("data", data);
          pageInfo = response.pageInfo;
        } while (pageInfo?.nextPage);
        for (const element of data) {
          // console.log("element", element);
          if (element.tags?.includes("EmailCheckrSubscriber")) {
            switch (element.state) {
              case "enabled":
                enabled++;
                break;
              case "disabled":
                disabled++;
                break;
              case "invited":
                invited++;
                break;
            }
          }
        }
    
        data = {id,invited,enabled,disabled,total:data.length}
      } catch (error) {
        data = error.message;
      }
      return data;
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
        new_data = await postLocal(admin.graphql,new_data);
        // console.log("new_data", new_data);
        let formdata = new FormData();
        formdata.append("_postMetafileds", JSON.stringify(new_data));
        const postData = await postMetafileds(admin,formdata,shop,accessToken);
    }
    // else if (_action === "graphql_billing"){
    //     let data = [];
    //     // console.log("reqbody",request);
    //    const { name } = {name:"business"};
    //    console.log("name", name);
    //     data = await GetCollectionMongoDB("trialdays",shop);
    //     console.log("datafromMongo", data);
    //     if (data == null) {
    //       billingConfig[name].trialDays = 7;
    //     } else {
    //       if (data.plan_subscription != "" && data.cancel_subscription == "1") {
    //         const a = new Date(data.plan_subscription);
    //         const b = new Date();
    //         let countDays = dateDiffInDays(a, b);
    //         billingConfig[name].trialDays = countDays < 7 ? 7 - countDays : 0;
    //       } else {
    //         const a = new Date(data.plan_subscription);
    //         const b = new Date(data.cancel_subscription);
    //         let countDays = dateDiffInDays(a, b);
    //         billingConfig[name].trialDays = countDays < 7 ? 7 - countDays : 0;
    //       }
    //     }
    //     console.log("In billing");
    //     const hasPayment = await hasBillingCheck(session,billing,name);
    //     console.log("billing_hasPayment", hasPayment);
    //     const billing_data = await hasBillingRequest(session,billing,name);
    //     console.log("billing_data", billing_data);
    //     if (hasPayment.hasActivePayment) {
    //       next();
    //     } else {
    //       return({
    //         data: await hasBillingRequest(session,billing,name)
    //       });
    //     }
    // }
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
            parse_data.segment = await get__segment(admin,session,accessToken,);;
            console.log("THIS IS THE FINAL DATA", parse_data);
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
    // else if (_action === "get_customer_segment"){
    //   const state = null;
    //   const customers = await getCustomersData(shop,accessToken,state);
    //   console.log("customers", customers);
    // }
    // else if (_action === "get_customer_segment"){
    //   // console.log("get_customer_segment");
    //   if (!admin) {
    //     throw new Error("Admin API is not initialized.");
    //   }
    
    //   let data = [];
    //   let invited = 0;
    //   let enabled = 0;
    //   let disabled = 0;
    //   let id = null;
    
    //   try {
    //     id = await GetCollectionMongoDB("customer_invited",session.shop);
    //     if (id == null) {
    //       return false;
    //     }
    
    //     let pageInfo;
    //     do {
    //       const state = null;
    //       let response = await getCustomersData(shop,accessToken,state);
    // // console.log("responce", response);
    //       data = data.concat(response);
    //       // console.log("data", data);
    //       pageInfo = response.pageInfo;
    //     } while (pageInfo?.nextPage);
    //     for (const element of data) {
    //       // console.log("element", element);
    //       if (element.tags?.includes("EmailCheckrSubscriber")) {
    //         switch (element.state) {
    //           case "enabled":
    //             enabled++;
    //             break;
    //           case "disabled":
    //             disabled++;
    //             break;
    //           case "invited":
    //             invited++;
    //             break;
    //         }
    //       }
    //     }
    
    //     data = {id,invited,enabled,disabled,total:data.length}
    //   } catch (error) {
    //     data = error.message;
    //   }
    //   return data;
    // }

    else if (_action === "for_check"){
      console.log("for check");
      const responce = await get__segment(admin,session,accessToken,);
      console.log("responceForcheck", responce);
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

