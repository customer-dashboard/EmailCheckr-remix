import { GetMongoData, MongoDB } from "../server/mongodb";
import { json } from '@remix-run/node';
import { authenticate } from "../shopify.server";
import { getStoreLanguages, getStoreThemes, deleteMetafields, postMetafileds, getSettings, getShopData, getCustomersData } from "../Modals/Grapql";
import { CurrentDate } from "../server/apicontroller";


export async function action({ request }) {
  const { admin, session } = await authenticate.admin(request);
  let status= 200;
  let data= [];
  const { shop,accessToken } = session;
  let myShop = shop.replace(".myshopify.com", "");
  const formValue = await request.formData();
  let _action = formValue.get("_action");
  
  try {
      switch (_action) {
        
        case "GET_LOCALS":
          const locals = await getStoreLanguages(admin.graphql);
          data = {locals:locals?.data,};
          return json({data,status})

        case "GET_THEMES":
          const themes = await getStoreThemes(admin.graphql);
          data = {themes:themes?.data,};
          return json({data,status})

        case "DELETE_METAFIELDS":
          const delete_cd_metafields = await deleteMetafields(admin,shop,accessToken);
          // console.log("deleteAllMetafields---", delete_cd_metafields);
          return json({delete_cd_metafields,status})

        case "POST_METAFIELD":
        const postMetafileds_ = await postMetafileds(admin,formValue,shop,accessToken);
        const postMetafileds__ = postMetafileds_;
          return json({postMetafileds__,status,statusText:"Setting Saved"})
        
        // case "get_account_validation_status":
        //   const get_account_validation_status = await getSettings(admin);
        //   console.log("get_account_validation_status", get_account_validation_status);
        //   return json({get_account_validation_status,status})
          
        case "get_installation_faq":
          try {
            const data = await GetMongoData("installation_faq");
            return { status: 200, data };
          } catch (error) {
            console.error("Error fetching installation FAQ:", error);
            return { status: 500, data: error.message };
          }
          
        default:
          break;
        }
  } catch (error) {
    data=error.message;
    status=500;
  }
  return json({data,status})
}


export const onAppInstall = async (admin,session) => {
    var data = await getShopData(admin,session);
    let { shop, accessToken } = session;
    const CustomerCount = await getCustomersData(shop, accessToken,'count');
    // console.log("CustomerCount",CustomerCount);
    // console.log("data",data.data.shop);
    data=data.data.shop;
    const resData = {
      shop: session.shop,
      email: data.email,
      phone: data.billingAddress.phone,
      shop_owner: data.shopOwnerName,
      customer: CustomerCount,
      date: CurrentDate(),
      status: 1,
    }
    const result = await MongoDB(resData,"shop_info");
    // console.log("result", result);
    return resData;
  }
