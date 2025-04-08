import { InsertUpdateData } from "./server/mongodb";

export const UninstallEvent = (session)=>{
  
      const resData = {
        status: 0,
      }
      const result = InsertUpdateData(session.shop, resData, 'shop_info');
      return result;
}

