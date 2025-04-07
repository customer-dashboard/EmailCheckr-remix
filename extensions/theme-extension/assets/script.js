pathname = window.location.pathname;
hostDomain = window.location.hostname;

console.log("pathname", pathname);
console.log("hostDomain", hostDomain);

// proxy = "verification";
proxy = "test-api";

var theme_form = document.querySelector(".customer.register");
if (theme_form) {
    theme_form.style.display = "none";
}
var elemDiv1 = document.createElement("div");
var elemDiv2 = document.createElement("div");
function myGreeting() {
  elemDiv2.style.bottom = "-100px";
}
function returnCall(value, color) {
  elemDiv2.style.bottom = "70px";
  elemDiv2.style.background = color;
  elemDiv2.innerHTML = value;
  setTimeout(myGreeting, 3000);
}
elemDiv1.classList.add("ev_parent_return_message");
elemDiv1.style.cssText = `display: flex; justify-content: center;`;
elemDiv2.classList.add("ev_return_message");
elemDiv2.style.cssText = `background: #000;z-index: 999;text-align: center;padding: 15px;border-radius: 5px;position: fixed;transition: bottom 0.4s ease-out;color: white;font-weight: 600;bottom: -100px;`;
elemDiv1.appendChild(elemDiv2);
document.body.appendChild(elemDiv1);
var form = document.querySelector("#registration-form");
if (form.length > 0) {
  async function InstallMetafields(path, data) {
    const response = await fetch(path, {
      method: "POST",
      headers: {
        'Content-Type': "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  }
  let billing = {};
  billing._action = "check_billing";
  InstallMetafields(`https://${hostDomain}/apps/${proxy}`, billing);
  form = form[0].form;
 
  var submit_button = document.querySelector(".btn-submit");

  // document.addEventListener("DOMContentLoaded", function () {
    // const form = document.getElementById("registration-form");
    const submitButton = document.querySelector(".btn-submit");
  
    const metafileds = window.shopMetafields.metafileds;
    let Translations = metafileds.translation;
    console.log("metafileds1", metafileds);
    console.log("Translations",Translations);
    const custom_css = metafileds.custom_css;     
    if (custom_css) {
      const style = document.createElement("style");
      style.innerHTML = custom_css;
      document.head.appendChild(style);
    }


    form.addEventListener("submit", async function (e) {
      e.preventDefault(); 

      const submitButton = this.querySelector("[type='submit']");
    
      submitButton.disabled = true;
  
      const originalText = submitButton.innerHTML;
  
      submitButton.innerHTML = `
          <span class="loader" style="
              display: inline-block;
              width: 16px;
              height: 16px;
              border: 2px solid white;
              border-top: 2px solid transparent;
              border-radius: 50%;
              animation: spin 1s linear infinite;
              vertical-align: middle;
              margin-right: 8px;
          "></span>`;
  
      const style = document.createElement("style");
      style.innerHTML = `
          @keyframes spin { 
              100% { transform: rotate(360deg); } 
          }
      `;
      document.head.appendChild(style);
  
      const formData = new FormData(form);
      const requestData = {
        _action: "profile_data",
        local: Shopify.locale,
        first_name: formData.get("first-name"),
        last_name: formData.get("last-name"),
        email: formData.get("email"),
      };

      const message_position = metafileds.message_position;
      const main_heading_color = metafileds.main_heading_color;
      const success_message_color = metafileds.success_message_color;
      const email = formData.get("email")
      console.log(email, "email");
      try {
        const response = await fetch(`https://${hostDomain}/apps/${proxy}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData),
        });
        const resData = await response.json();
console.log("responce 00", resData.message);
        if (resData.message === "successfully_get") {

          submitButton.disabled = false;
          submitButton.innerHTML = originalText; 
          if (typeof(Translations) === "string") {
            try {
              Translations = JSON.parse(Translations);
            } catch (error) {
              console.error("Error parsing translations JSON:", error);
              Translations = {};
            }
          }
          
          function cleanTranslationKeys(data) {
            // console.log("data",data); 
            const cleanedData = {};
            Object.entries(data).forEach(([lang, messages]) => {
              cleanedData[lang] = {};
              Object.entries(messages).forEach(([key, value]) => {
                const newKey = key.replace(/\[EMAIL\]/g, ""); // Remove [EMAIL] from key
                const newValue = value.replace(/\[EMAIL\]/g, `${email}`); // Replace [EMAIL] in value
                cleanedData[lang][newKey] = newValue;
                console.log("cleanedData",cleanedData);
              });
            });
            return cleanedData;
          }
          
          if (typeof Translations === "object" && !Array.isArray(Translations)) {
            Translations = cleanTranslationKeys(Translations);
            console.log("Cleaned Translations:", Translations);
          } else {
            console.error("Invalid translations format:", Translations);
          }
          
          const pathLang = window.location.pathname.split("/")[1];
          
          const langMap = {
            en: "english",
            fr: "french",
            es: "spanish",
            de: "german",
            it: "italian",
            hi: "hindi",
            ur: "urdu",
            nl: "dutch",
            my: "burmese",
            ak: "akan",
          };
          
          const userLangKey = langMap[pathLang] || "english";
          console.log("Detected User Language:", userLangKey);
          
          const successMessage =
            Translations[userLangKey]?.we_have_sent_an_email_to__please_click_the_link_included_to_verify_your_email_address ||
            `We have sent an email to ${email} please click the link included to verify your email address`;
          const cav_heading =
            Translations[userLangKey]?.please_adjust_the_following ||
            `Please adjust the following`;
          // const cav_error =
          //   Translations[userLangKey]?.this_email_has_already_been_used_for_registration! ||
          //   `This email has already been used for registration!`;
          
          console.log("Success Message:", successMessage);

            if (message_position === "middle") {
              submitButton.insertAdjacentHTML("beforebegin", `<p style="color: ${main_heading_color}; font-size: 18px;">${cav_heading}</p>`);
              submitButton.insertAdjacentHTML("beforebegin", `<p style="color: ${success_message_color}; font-size: 16px;">${successMessage}</p>`);
          } else {
            form.insertAdjacentHTML(message_position, `<p style="color: ${main_heading_color}; font-size: 18px;">${cav_heading}</p>`);
              form.insertAdjacentHTML(message_position, `<p style="color: ${success_message_color}; font-size: 16px;">${successMessage}</p>`);
          }
        } else {
          throw new Error(resData.message || "Something went wrong!");
        }
      } catch (error) {
        submitButton.disabled = false;
        submitButton.innerHTML = originalText; 
      //   if (message_position === "middle") {
      //     submitButton.insertAdjacentHTML("beforebegin", `<h6 style="color: red; font-size:20px;">This email has already been used for registration!</h6>`);
      // } else {
      //   form.insertAdjacentHTML(message_position, `<h2 style="color: red; font-size:20px;">This email has already been used for registration!</h2>`);
      // }
      returnCall(`This email has already been used for registration!`, "#da2f0c");
      }
    });
  // });
}
