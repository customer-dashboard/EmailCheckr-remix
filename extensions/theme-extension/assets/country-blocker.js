// (async () => {
//   const pathname = window.location.pathname;
//   const hostDomain = window.location.hostname;
//   const proxy = "verification-1";

//   console.log("metafileds0", window.shopMetafields);

//   async function InstallMetafields(path, data) {
//     const response = await fetch(path, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(data),
//     });
//     console.log("responce of countryblocker", response);
//     return await response;
//   }

//   let country = { target: "get_country" };

//   try {
//     // const response = await InstallMetafields(`https://${hostDomain}/apps/${proxy}`, country);
// // console.log("res", response);
// console.log("window", window);
// console.log("shopify", window.Shopify.country);
//     // if (response.status === 403) {
//     if (window.Shopify.country == "IN") {
//       document.body.innerHTML = `
//         <div style="
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           height: 100vh;
//           background: linear-gradient(135deg, #1f2937, #4b5563);
//           color: white;
//           font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
//           text-align: center;
//           padding: 2rem;
//         ">
//           <img src="https://cdn-icons-png.flaticon.com/512/564/564619.png" alt="Blocked" style="width: 100px; height: 100px; margin-bottom: 1rem;" />
//           <h1 style="font-size: 2.5rem; margin-bottom: 0.5rem; color: red;">Access Denied</h1>
//           <p style="font-size: 1.2rem; max-width: 500px;">
//             We're sorry, but our store is not accessible from your country.
//           </p>
//         </div>
//       `;
//     }
//   } catch (error) {
//     console.error("Error checking access:", error);
//   }
// })();


document.addEventListener("DOMContentLoaded", () => {
  if (window.shopMetafields && window.shopMetafields.metafields) {
    const data = window.shopMetafields.metafields;
    console.log("Country blocker metafield:", data);
    // console.log("shopify", window.Shopify);
 
    const blockedCountries = data.countryData.setup.selectedTags || [];
    const status = data.countryData.setup.selected;
    const content = data.countryData.content;
    const settings = data.countryData.settings.setting;

    console.log("Country blocker status:", status);
    console.log("blockedCountries:", blockedCountries);

    const getUserIP = async () => {
      const res = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();
      return data.ip; 
    };
    
    const getCountryFromIP = async (ip) => {
      const res = await fetch(`https://ipapi.co/${ip}/json/`);
      const data = await res.json();
      return data.country_code; 
    };
    
    if(status == 'enable'){
    (async () => {
      try {
        const ip = await getUserIP();
        console.log("IP Address:", ip);
    
        const countryCode = await getCountryFromIP(ip);
        console.log("Detected Country Code:", countryCode);
    
        // const blockedCountries = ['US', 'BR', 'FR', 'DE', 'AF', 'IN'];
        if (blockedCountries.includes(countryCode)) {

          document.body.innerHTML = `
          <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            background: linear-gradient(135deg, #1f2937, #4b5563);
            color: white;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            text-align: center;
            padding: 2rem;
          ">
            <img src="https://cdn-icons-png.flaticon.com/512/564/564619.png" alt="Blocked" style="width: 100px; height: 100px; margin-bottom: 1rem;" />
            <h1 style="font-size: ${settings.typography.heading_font_size}px; margin-bottom: 0.5rem; color: ${settings.heading_color.heading_color};">${content.heading}</h1>
            <p style="font-size: ${settings.typography.description_font_size}px; max-width: 500px; color: ${settings.description_color.description_color};">
            ${content.description}
            </p>
          </div>
        `;
          console.warn("Access blocked for:", countryCode);
          console.log('%c------ Country blocker: Access blocked for:'+countryCode+' ------', 'color: cyan');
        }
      } catch (err) {
        console.error("Geolocation error:", err);
      }
    })();
  }else{
    console.warn('country blocker status is disabled from app.');
  }

    //     if (blockedCountries.includes(window.Shopify.country)) {
    //   document.body.innerHTML = `
    //     <div style="
    //       display: flex;
    //       flex-direction: column;
    //       align-items: center;
    //       justify-content: center;
    //       height: 100vh;
    //       background: linear-gradient(135deg, #1f2937, #4b5563);
    //       color: white;
    //       font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    //       text-align: center;
    //       padding: 2rem;
    //     ">
    //       <img src="https://cdn-icons-png.flaticon.com/512/564/564619.png" alt="Blocked" style="width: 100px; height: 100px; margin-bottom: 1rem;" />
    //       <h1 style="font-size: 2.5rem; margin-bottom: 0.5rem; color: red;">Access Denied</h1>
    //       <p style="font-size: 1.2rem; max-width: 500px;">
    //         We're sorry, but our store is not accessible from your country.
    //       </p>
    //     </div>
    //   `;
    // }
    // Use the data as needed...
  } else {
    console.warn("Shop metafields not found.");
  }
});
