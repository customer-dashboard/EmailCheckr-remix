document.addEventListener("DOMContentLoaded", async () => {
  if (window.shopMetafields && window.shopMetafields.metafields) {
    const data = window.shopMetafields.metafields;
    // console.log("Country blocker metafield:", data);
    // console.log("shopify", window.Shopify);
    const selectedTemplate = data.countryData?.template ?? "template2";

    // console.log("selectedTemp", selectedTemplate);
    const blockedCountries = data.countryData.setup.selectedTags || [];
    // const blockedPages = data.countryData.setup.selectedTags2 || ["allpages"];
    const selectedTags2 = data.countryData.setup.selectedTags2;
    const blockedPages = (Array.isArray(selectedTags2) && selectedTags2.length > 0) 
      ? selectedTags2 
      : ["allpages"];
    const status = data.countryData.setup.selected;
    const content = data.countryData[selectedTemplate].content;
    const settings = data.countryData[selectedTemplate].settings.setting;

    const icon = {
      template1: "https://cdn-icons-png.flaticon.com/512/595/595067.png",
      template2: "https://cdn-icons-png.flaticon.com/512/564/564619.png",
      template3: "https://cdn-icons-png.flaticon.com/512/564/564619.png",
    };
    // console.log("Country blocker status:", status);
    // console.log("blockedCountries:", blockedCountries);warning_3756712

    const getUserIP = async () => {
      const res = await fetch("https://api.ipify.org?format=json");
      const data = await res.json();
      return data.ip;
    };

    const getCountryFromIP = async (ip) => {
      const res = await fetch(`https://ipapi.co/${ip}/json/`);
      const data = await res.json();
      return data.country_code;
    };

    function getCurrentPageType() {
      const path = window.location.pathname;

      // if (Shopify && Shopify.checkout) return "checkout";
      if (path === "/") return "home";
      if (path.includes("/pages/")) return "page";
      if (path.includes("/products/")) return "product";
      if (path.includes("/collections/")) return "collection";
      if (path.includes("/blogs/") && path.includes("/articles/"))
        return "article";
      if (path.includes("/blogs/")) return "blog";
      if (path.includes("/cart")) return "cart";
      if (path.includes("/account")) return "account";
      if (path.includes("/search")) return "search";

      return "unknown";
    }

    const currentPageType = getCurrentPageType();
    console.log("currentPageType", currentPageType);

    if (status == "enable") {
      if (
        blockedPages.includes("allpages") ||
        blockedPages.includes(currentPageType)
      ) {
        (async () => {
          try {
            const ip = await getUserIP();
            // console.log("IP Address:", ip);

            const countryCode = await getCountryFromIP(ip);
            // console.log("Detected Country:", countryCode);

            // const blockedCountries = ['US', 'BR', 'FR', 'DE', 'AF', 'IN'];
            if (blockedCountries.includes(countryCode)) {
              let alignItems = "center";

              if (data.countryData?.template === "template1") {
                alignItems = "flex-start";
              } else if (data.countryData?.template === "template2") {
                alignItems = "center";
              } else if (data.countryData?.template === "template3") {
                alignItems = "flex-end";
              }

              const parentDiv = `
                display: flex;
                align-items: ${alignItems};
                justify-content: center;
                padding: 130px 50px;
                background-color: ${settings?.background_color?.background_color};
                height: 100vh;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              `;

              const baseStyles = `
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 200px;
                height: 100%;
                text-align: center;
                flex-direction: column;
                width: ${settings?.typography?.container_width}px;
                line-height: ${settings?.typography?.line_height}px;
                padding: 15px;
                height: auto;
                color: ${settings.description_color.description_color};
              `;

              let boxedStyles = "";

              if (settings?.form_style === "boxed") {
                boxedStyles = `
                  background-color: ${settings?.box_background_color?.box_background_color};
                  border: 1px solid ${settings?.border_color?.border_color};
                  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);
                `;
              }
              document.body.innerHTML = `
              <style>
                .parentElement p {
                  margin: 0;
                }
              </style>
          <div class="parentElement" style="${parentDiv}">
          <div style="${baseStyles + boxedStyles}">
            <img src=${icon[selectedTemplate]} alt="Blocked" style="width: 50px; height: 50px; margin-bottom: 1rem;" />
            <h1 style="font-size: ${settings.typography.heading_font_size}px; font-weight: 600; margin: 0.5rem 0; color: ${settings.heading_color.heading_color};">${content.heading}</h1>
           
            ${content.description}
         
          </div>
          </div>
        `;
              console.warn("Access blocked for:", countryCode);
              console.log(
                "%c------ Country blocker: Access blocked for:" +
                  countryCode +
                  " ------",
                "color: cyan",
              );
            }
          } catch (err) {
            console.error("Geolocation error:", err);
          }
        })();
      }
    } else {
      console.warn("country blocker status is disabled from app.");
    }
  } else {
    console.warn("Shop metafields not found.");
  }
});
