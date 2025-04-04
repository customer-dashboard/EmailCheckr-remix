import { InsertUpdateData } from "./server/mongodb";

export const UninstallEvent = (session)=>{
  console.log("app has uninstalled", session);
  
      const resData = {
        status: 0,
      }
      const result = InsertUpdateData(session.shop, resData, 'shop_info');
      console.log("result", result);
      return resData;
}

