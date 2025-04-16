// import React, { useEffect, useMemo } from "react";
import Welcome from "../../universal-components/on-boarding/Welcome";
import GridSkeleton from "../../universal-components/on-boarding/GridSkeleton";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
function index(props) {
  const { classic, setOnBoarding, appStatus, enableTheme, billing, themes, myShop, isShopifyPlus } = props;
  const [themeStatus, setthemeStatus] = useState(false);
  useEffect(() => {
    if (themes?.theme) {
    setthemeStatus(!themes?.theme?.disabled);
    }
  }, [themes])
  const navigate = useNavigate();
  // const onBoardValue = JSON.parse(localStorage.getItem("dp_onboard")) ?? true;
  // if (!onBoardValue) {
  //   navigate("/");
  // }
  const onBoardValue = useMemo(() => {
    // return JSON.parse(localStorage.getItem("dp_onboard")) ?? true;
  }, []);

  useEffect(() => {
    if (!onBoardValue) {
      navigate("/app");
    } 
  }, [onBoardValue]); 
  
  useEffect(()=>{
    if (billing?.status === 'active' && appStatus && classic?.customerAccountsVersion === 'CLASSIC') {
      setOnBoarding(false)
      localStorage.setItem(`dp_onboard${myShop}`, JSON.stringify(false));
     setTimeout(() => {
      navigate("/app", {replace:true});
     }, 100);
   }
  },[billing,appStatus,classic])
  

  return (
    <>
      {classic?.customerAccountsVersion === "CLASSIC" ? (
        <Welcome
        type="CLASSIC"
        classic={classic}
        setOnBoarding={setOnBoarding}
        appStatus={appStatus}
        enableTheme={enableTheme}
        billing={billing}
        themes={themes}
        myShop={myShop}
        isShopifyPlus={isShopifyPlus}
      />
        ) : classic?.customerAccountsVersion === "NEW_CUSTOMER_ACCOUNTS" ? (
          <Welcome 
          type={"NEW_CUSTOMER_ACCOUNTS"}
          classic={classic}
          setOnBoarding={setOnBoarding}
          appStatus={appStatus}
          enableTheme={enableTheme}
          billing={billing}
          themes={themes}
          myShop={myShop}
          isShopifyPlus={isShopifyPlus}
          />
        ) :  (
        <GridSkeleton/>
      )}
    </>
  );
}

export default index;