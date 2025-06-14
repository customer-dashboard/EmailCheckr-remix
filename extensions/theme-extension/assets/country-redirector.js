document.addEventListener("DOMContentLoaded", () => {
  if (window.shopMetafields && window.shopMetafields.countryredirector) {
    const data = window.shopMetafields.countryredirector;
    const country_redirector = data?.country_redirector || {};
    // console.log("country_redirector", country_redirector);


  (async function redirectByCountry() {
    if (!country_redirector.country_redirector_status) return;

    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();

      const userCountry = data.country_code; // e.g., 'US', 'IN'
      let redirectUrl = country_redirector.redirectUrl;

      // Ensure redirect URL has https://
      if (!redirectUrl.startsWith("http://") && !redirectUrl.startsWith("https://")) {
        redirectUrl = "https://" + redirectUrl;
      }

      // Only redirect if country matches and we're not already on the redirect page
      if (
        country_redirector.selectedCountries.includes(userCountry) &&
        window.location.href !== redirectUrl
      ) {
        window.location.replace(redirectUrl);
      }
    } catch (error) {
      console.error("Country Redirector error:", error);
    }
  })();

  }
});
