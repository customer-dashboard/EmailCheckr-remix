(async () => {
  const pathname = window.location.pathname;
  const hostDomain = window.location.hostname;
  const proxy = "verification-1";

  async function InstallMetafields(path, data) {
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    console.log("responce of countryblocker", response);
    return await response;
  }

  let country = { target: "get_country" };

  try {
    const response = await InstallMetafields(`https://${hostDomain}/apps/${proxy}`, country);
console.log("res", response);
    if (response.status === 403) {
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
          <h1 style="font-size: 2.5rem; margin-bottom: 0.5rem; color: red;">Access Denied</h1>
          <p style="font-size: 1.2rem; max-width: 500px;">
            We're sorry, but our store is not accessible from your country.
          </p>
        </div>
      `;
    }
  } catch (error) {
    console.error("Error checking access:", error);
  }
})();
