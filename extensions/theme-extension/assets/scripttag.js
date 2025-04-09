pathname = window.location.pathname;
hostDomain = window.location.hostname;
proxy = "verification";

document.addEventListener("DOMContentLoaded", function () {
  var formInputs = document.querySelectorAll("input[value=create_customer]");
  formInputs.forEach(function (input) {
    var parentForm = input.closest("form"); 
    if (parentForm) {
      var wrapperDiv = document.createElement("div");
      wrapperDiv.setAttribute("data-theme-embedded", ""); 
      parentForm.parentNode.insertBefore(wrapperDiv, parentForm);
      wrapperDiv.appendChild(parentForm);
    }
  });
});

// proxy = "verification";
var form = document.querySelectorAll("input[value=create_customer]");

// console.log("form",form.length);
if (form.length > 0) {
  async function InstallMetafields(path, data) {
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  }
  let billing = {};
  billing._action = "check_billing";
  InstallMetafields(`https://${hostDomain}/apps/${proxy}`, billing);
  form = form[0].form;
  var password = form.querySelectorAll("input[type=password]");
  for (let i = 0; i < password.length; i++) {
    password[i].parentElement.remove();
  }
  var submit_button = form.querySelectorAll("input[type=submit]")[0];
  var mainTag2 = form.getElementsByTagName("button")[0];
  submit_button = submit_button || mainTag2;
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
  elemDiv2.style.cssText = `background: #000;z-index: 999;text-align: center;padding: 15px;border-radius: 5px;position: fixed;transition: bottom 0.4s ease-out;color: white;font-weight: 600;bottom: -120px;`;
  elemDiv1.appendChild(elemDiv2);
  document.body.appendChild(elemDiv1);
  submit_button.type = "button";
  submit_button.addEventListener("click", async function (e) {
    submit_button.disabled = true;
  
    const originalText = submit_button.innerHTML;

    submit_button.innerHTML = `
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

    const style_ = document.createElement("style");
    style_.innerHTML = `
        @keyframes spin { 
            100% { transform: rotate(360deg); } 
        }
    `;
    document.head.appendChild(style_);
    var formData = new FormData(form);
    var array = {};
    array._action = "profile_data";
    array.local = Shopify.locale;
    for (var pair of formData.entries()) {
      if (pair[0] == "customer[first_name]") array["first_name"] = pair[1];
      else if (pair[0] == "customer[last_name]") array["last_name"] = pair[1];
      else if (pair[0] == "customer[email]") array["email"] = pair[1];
      else if (pair[0] == "customer[password]") array["password"] = pair[1];
      else if (pair[0] == "customer[accepts_marketing]") array["accepts_marketing"] = pair[1];
      else if (pair[0] == "customer[tags]") array["tags"] = pair[1];
    }
    const resData = await InstallMetafields(`https://${hostDomain}/apps/${proxy}`, array);
    // console.log("resData", resData);
    if (resData.status == 200) {
      submit_button.disabled = false;
      submit_button.innerHTML = originalText; 
      var style = document.createElement("style");
      // style.type = "text/css";
      style.innerHTML = resData?.data?.css;
      document.getElementsByTagName("head")[0].appendChild(style);
      // console.log("resData.message", resData.message);
      if (resData?.data?.position == "middle")
        submit_button.insertAdjacentHTML("beforebegin", resData.data.getemail);
      else
        form.insertAdjacentHTML(resData?.data?.position, resData.data.getemail);
    } else {
      submit_button.disabled = false;
      submit_button.innerHTML = originalText; 
      returnCall(resData?.data?.error_msg, "#da2f0c");
    }
  });
}
