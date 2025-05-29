document.addEventListener("DOMContentLoaded", () => {
  if (window.shopMetafields && window.shopMetafields.contentprotector) {
    const data = window.shopMetafields.contentprotector;
    const contentprotector = data?.content_protector;
    // console.log("contentprotector", contentprotector);

  // Disable right-click
  if (contentprotector.deactivate_right_click) {
    document.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  // Disable text selection
  if (contentprotector.protect_content) {
    document.addEventListener("selectstart", (e) => e.preventDefault());
  }

  // Block shortcuts
  if (contentprotector.deactivate_shortcut || contentprotector.deactivate_inspect) {
    document.addEventListener("keydown", (e) => {
      const key = e.key.toLowerCase();
      if (
        (e.ctrlKey && ["u", "s", "c", "x", "a"].includes(key)) ||  
        (e.key === "F12") ||                                       
        (e.ctrlKey && e.shiftKey && key === "i")                   
      ) {
        e.preventDefault();
      }
    });
  }

 
  const devToolsDetect = () => {
    const threshold = 160;
    if (
      window.outerWidth - window.innerWidth > threshold ||
      window.outerHeight - window.innerHeight > threshold
    ) {
      document.body.innerHTML = "";
    //   alert("DevTools is blocked!");
    }
  };

  setInterval(devToolsDetect, 1000);


  setInterval(() => {
    const before = new Date();
    debugger;
    const after = new Date();
    if (after - before > 100) {
      document.body.innerHTML = "";
    }
  }, 1000);

 
  if (contentprotector.deactivate_inspect) {
    console.log = console.warn = console.error = console.info = function () {};
  }
  }
});
