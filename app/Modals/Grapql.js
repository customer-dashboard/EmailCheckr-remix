import { billingConfig } from "../../app/routes/billing";

export async function getStoreLanguages(graphql) {
  const locals = await graphql(`
    query {
      shopLocales {
        locale
        name
        primary
        published
      }
    }
  `);
  const response = await locals.json();
  return response;
}

export async function postLocal(graphql, new_data) {
  let shopLocal = [];
  const query = await graphql(`
    query {
      shopLocales {
        locale
        name
        primary
        published
      }
    }
  `);
  const response = await query.json();
  // console.log("lang",response);
  shopLocal = response?.data?.shopLocales;
  shopLocal.forEach((element) => {
    let local_obj = element.name.toLowerCase();
    new_data.translation[local_obj] = new_data.translation[local_obj]
      ? new_data.translation[local_obj]
      : new_data.translation.english;
  });
  return new_data;
}

export async function getStoreThemes(graphql) {
  const themes = await graphql(`
    query {
      themes(first: 20) {
        edges {
          node {
            name
            id
            role
          }
        }
      }
    }
  `);
  const response = await themes.json();
  return response;
}

export async function setTranslation(admin, formValue, shop, accessToken) {
  let formDatavalue = formValue.get("translation_data");
  let shopGid = await getShopId(shop, accessToken);
  const formdata = JSON.stringify(formDatavalue);

  try {
    const translations = await admin.graphql(
      `#graphql
      mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            key
            namespace
            value
            createdAt
            updatedAt
          }
          userErrors {
            field
            message
            code
          }
        }
      }`,
      {
        variables: {
          metafields: [
            {
              key: "Translations",
              namespace: "customer_accounts_email_verification",
              ownerId: shopGid,
              type: "multi_line_text_field",
              value: formdata,
            },
          ],
        },
      },
    );

    const response = await translations.json();
    return response;
  } catch (error) {
    // console.error("Error in setTranslation:", error);
    // throw error;
  }
}

export async function getTranslation(admin) {
  const get_meta = await admin.graphql(
    `query MyQuery {
      shop {
        metafields(namespace: "customer_accounts_email_verification", first: 10) {
          edges {
            node {
              id
              key
              value
            }
          }
        }
      }
    }`,
  );
  const response = await get_meta.json();
  return response;
}

export async function deleteMetafields(admin, shop, accessToken) {
  let shopGid = await getShopId(shop, accessToken);
  const response = await admin.graphql(
    `#graphql
    mutation MetafieldsDelete($metafields: [MetafieldIdentifierInput!]!) {
      metafieldsDelete(metafields: $metafields) {
        deletedMetafields {
          key
          namespace
          ownerId
        }
        userErrors {
          field
          message
        }
      }
    }`,
    {
      variables: {
        metafields: [
          {
            namespace: "customer_accounts_email_verification",
            ownerId: shopGid,
            key: "Settings",
          },
        ],
      },
    },
  );
  const responseJson = await response.json();
  return responseJson;
}

export async function getShopId(shop, accessToken) {
  const endpoint = `https://${shop}/admin/api/2023-10/graphql.json`;
  const query = `
  {
    shop {
      id
    }
  }
`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },
      body: JSON.stringify({ query }),
    });

    const result = await response.json();
    return result.data?.shop?.id || null;
  } catch (error) {
    console.error("Error fetching shop ID:", error);
    return null;
  }
}

export async function postMetafileds(admin, formValue, shop, accessToken) {
  let formDatavalue = formValue.get("_postMetafileds");
  let shopGid = await getShopId(shop, accessToken);
  try {
    const metafileds = await admin.graphql(
      `#graphql
      mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            key
            namespace
            value
            createdAt
            updatedAt
          }
          userErrors {
            field
            message
            code
          }
        }
      }`,
      {
        variables: {
          metafields: [
            {
              key: "Settings",
              namespace: "customer_accounts_email_verification",
              ownerId: shopGid,
              type: "json",
              value: formDatavalue,
            },
          ],
        },
      },
    );

    const response = await metafileds.json();
    return response;
  } catch (error) {
    // console.error("Error in setTranslation:", error);
    // throw error;
  }
}

export async function getSettings(admin) {
  try {
    const get_setting = await admin.graphql(
      `query MyQuery {
        shop {
          metafields(namespace: "customer_accounts_email_verification", first: 10) {
            edges {
              node {
                id
                key
                value
              }
            }
          }
        }
      }`,
    );
    const response = await get_setting.json();
    // const data = response.data.shop.metafields.edges;
    const metafields = response?.data?.shop?.metafields?.edges;

    // Filter metafields by key
    const keyName = "Settings";
    const targetMetafield = metafields.find(
      (edge) => edge.node.key === keyName,
    );
    return targetMetafield ? targetMetafield?.node?.value : null;
  } catch (error) {
    // console.error("Error fetching settings:", error);
    return null;
  }
}

export async function getbilling(session, billing) {
  let plans = Object.keys(billingConfig);
  for (let index = 0; index < plans.length; index++) {
    const element = plans[index];
    // console.log("element", element);
    const hasPayment = await hasBillingCheck(session, billing, element);
    if (hasPayment.hasActivePayment) {
      let array = {};
      array.id = hasPayment.appSubscriptions[0].id;
      array.name = hasPayment.appSubscriptions[0].name;
      array.status = "active";
      array.check = 200;
      return array;
    }
  }
  return { check: 200 };
}

export async function checkCustomerEmailAdmin(shop, reqbody, accessToken) {
  try {
    // Corrected string interpolation for the URL
    const response = await fetch(
      `https://${shop}/admin/api/2023-07/customers/search.json?query=email:${reqbody.email}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": accessToken,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error checking customer email:", error.message);
    return { error: error.message };
  }
}

export async function postProfileData(shop, reqbody, accessToken) {
  console.log("reqBody", reqbody);
  try {
    const url = `https://${shop}/admin/api/2025-01/customers.json`;
    const tags = reqbody?.tags ? "EmailCheckrSubscriber," + reqbody.tags : "EmailCheckrSubscriber";
    const requestbody = {
      customer: {
        first_name: reqbody.first_name,
        last_name: reqbody.last_name,
        email: reqbody.email,
        tags: tags,
        verified_email: true,
        send_email_welcome: false,
        send_email_invite: true,
        ...(reqbody.accepts_marketing && {
          email_marketing_consent: {
            state: "subscribed",
            opt_in_level: "single_opt_in",
          },
        }),
      },
    };
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestbody),
    });

    if (!response.ok) {
      // Handle HTTP errors
      const errorResponse = await response.json();
      throw new Error(
        `Shopify API Error: ${errorResponse.errors || response.statusText}`,
      );
    }

    const data = await response.json()
    console.log("data customer", data);
    return data;
  } catch (error) {
    console.error("Error posting profile data:", error.message);
    return { error: error.message };
  }
}

// export async function updateProfileData(shop, customerId, accessToken, reqbody) {
//   console.log("updating profile data");
//   console.log("reqbody", reqbody);
//   try {
//     const inviteUrl = `https://${shop}/admin/api/2025-01/customers/${customerId}/send_invite.json`;
//     const tags = reqbody?.tags ? "EmailCheckrSubscriber," + reqbody.tags : "EmailCheckrSubscriber";

//     const inviteResponse = await fetch(inviteUrl, {
//       method: "POST",
//       headers: {
//         "X-Shopify-Access-Token": accessToken,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         tags: tags,
//         customer_invite: {
//           custom_message: "Welcome! Please activate your account.",
//         }
//       }),
//     });

//     if (!inviteResponse.ok) {
//       const inviteError = await inviteResponse.json();
//       throw new Error(`Invite Error: ${JSON.stringify(inviteError.errors || inviteResponse.statusText)}`);
//     }

//     const inviteData = await inviteResponse.json();
//     return inviteData;
//   } catch (error) {
//     console.error("Error:", error.message);
//     return { error: error.message };
//   }
// }

export async function updateProfileData(shop, customerId, accessToken, reqbody, oldTags) {
  console.log("Updating profile data");
  console.log("oldTags", oldTags);
  try {
    const updateUrl = `https://${shop}/admin/api/2025-01/customers/${customerId}.json`;

    const tags = oldTags ? "EmailCheckrSubscriber," + oldTags : "EmailCheckrSubscriber";

    // Update the customer
    const updateResponse = await fetch(updateUrl, {
      method: "PUT",
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer: {
          id: customerId,
          tags: tags
        }
      }),
    });

    if (!updateResponse.ok) {
      const updateError = await updateResponse.json();
      throw new Error(`Customer Update Error: ${JSON.stringify(updateError.errors || updateResponse.statusText)}`);
    }

    const inviteUrl = `https://${shop}/admin/api/2025-01/customers/${customerId}/send_invite.json`;

    const inviteResponse = await fetch(inviteUrl, {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer_invite: {
          custom_message: "Welcome! Please activate your account.",
        }
      }),
    });

    if (!inviteResponse.ok) {
      const inviteError = await inviteResponse.json();
      throw new Error(`Invite Error: ${JSON.stringify(inviteError.errors || inviteResponse.statusText)}`);
    }

    const inviteData = await inviteResponse.json();
    return inviteData;
  } catch (error) {
    console.error("Error:", error.message);
    return { error: error.message };
  }
}


export async function createSegment(name, status, shop, accessToken) {
  const endpoint = `https://${shop}/admin/api/2025-01/graphql.json`;
  const query = `
    mutation CreateSegmentV2($name: String!, $query: String!) {
      segmentCreate(name: $name, query: $query) {
        segment {
          id
        }
        userErrors {
          field
          message
          __typename
        }
        __typename
      }
    }
  `;

  const variables = {
    name: name,
    // query: `customer_account_status = '${status}' AND customer_tags CONTAINS 'EmailCheckrSubscriber'`,
    query: `customer_account_status = '${status}'`,
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const result = await response.json();

    if (!response.ok || result.errors) {
      throw new Error(
        result.errors?.[0]?.message || "Failed to create segment",
      );
    }

    const userErrors = result.data.segmentCreate.userErrors;

    if (userErrors.length > 0) {
      console.error("Segment creation failed with errors:", userErrors);
      return { error: userErrors };
    }

    return result.data.segmentCreate.segment.id;
  } catch (error) {
    return { error: error.message };
  }
}

export async function hasBillingCheck(session, billing, name) {
  let isTest = false;
  if (
    session.shop === "silver-heritage-heaven.myshopify.com" ||
    session.shop === "my-diamond-story.myshopify.com" ||
    session.shop === "my-public-app.myshopify.com"
  ) {
    isTest = true;
  }
  // console.log("session", session);
  // console.log("billing", billing);

  var newShop = session.shop;
  var shop = newShop.replace(".myshopify.com", "");

  return await billing.require({
    plans: Object.keys(billingConfig),
    isTest: isTest,
    returnObject: true,
    onFailure: async () =>
      billing.request({
        plan: name,
        isTest: isTest,
        returnUrl: `https://admin.shopify.com/store/${shop}/apps/customer-account-verification/app`,
      }),
  });
}


export async function getCheckbillingNew(session, billing, name) {
  let isTest = false;
  if (
    session.shop === "silver-heritage-heaven.myshopify.com" ||
    session.shop === "my-public-app.myshopify.com"
  ) {
    isTest = true;
  }
  console.log("session", session);
  console.log("billing", billing);

  var newShop = session.shop;
  var shop = newShop.replace(".myshopify.com", "");

  return await billing.check({
    plans: Object.keys(billingConfig),
    isTest: isTest,
    returnObject: true,
    onFailure: async () =>
      billing.request({
        plan: name,
        isTest: isTest,
        returnUrl: `https://admin.shopify.com/store/${shop}/apps/customer-account-verification/app`,
      }),
  });
}

export async function hasBillingRequest(session, billing, name) {
  let isTest = false;
  if (
    session.shop === "silver-heritage-heaven.myshopify.com" ||
    session.shop === "my-public-app.myshopify.com"
  ) {
    isTest = true;
  }
  var newShop = session.shop;
  var shop = newShop.replace(".myshopify.com", "");
  return await billing.require({
    plans: Object.keys(billingConfig),
    isTest: isTest,
    returnObject: true,
    onFailure: async () =>
      billing.request({
        plan: name,
        isTest: isTest,
        returnUrl: `https://admin.shopify.com/store/${shop}/apps/customer-account-verification/app`,
      }),
  });
}

export async function getCustomersData(shop, accessToken, state = null) {
  const baseUrl = `https://${shop}/admin/api/2023-10`;
  const headers = {
    "Content-Type": "application/json",
    "X-Shopify-Access-Token": accessToken,
  };

  if (state === "count") {
    const response = await fetch(`${baseUrl}/customers/count.json`, {
      method: "GET",
      headers,
    });
    const data = await response.json();
    // console.log("dataCount", data.count);
    return data.count;
  }

  let endpoint = `${baseUrl}/customers.json`;
  if (state) {
    endpoint += `?state=${state}`;
  }

  const response = await fetch(endpoint, {
    method: "GET",
    headers,
  });

  const data = await response.json();
  return data.customers;
}

export const checkLocal = async (admin, session, data) => {
  const locals = await admin.graphql(
    `query {
        shopLocales {
            locale
            name
        }
        }`,
  );
  const local = await locals.json();
  data = local.data.shopLocales.filter((element) => element.locale == data);
  return data;
};

export const getShopData = async (admin, session) => {
  const response = await admin.graphql(
    `#graphql
    query {
      shop {
        name
        email
          billingAddress {
            phone
          }
        shopOwnerName
        plan{
          shopifyPlus
        }
        customerAccountsV2  { 
            customerAccountsVersion 
          } 
      }
    }`,
  );

  const data = await response.json();
  // console.log("shopData", data.data);
  return data;
};


export const getAppStatus = async (session, data) => {
  const { accessToken, shop } = session;
  // const blog_id = "2433038045295417455"; //Live
  const blog_id = "9545152174720515545";  //Development

  try {
    let array = [];

    for (const theme of data) {
      const themeId = theme.node.id.split("/").pop();

      const response = await fetch(
        `https://${shop}/admin/api/2024-10/themes/${themeId}/assets.json?asset[key]=config/settings_data.json`,
        {
          method: "GET",
          headers: {
            "X-Shopify-Access-Token": accessToken,
            "Content-Type": "application/json",
          },
        }
      );

      let json = null;
      try {
        const text = await response.text();
        if (text) {
          json = JSON.parse(text);
        } else {
          console.warn(`⚠️ Empty response for theme ${themeId}`);
          continue;
        }
      } catch (err) {
        console.warn(`❌ Failed to parse JSON response for theme ${themeId}:`, err);
        continue;
      }

      // Now parse the asset value safely
      if (json?.asset?.value) {
        try {
          const themeData = JSON.parse(json.asset.value);
          const blocks = themeData?.current?.blocks || {};
          const block = blocks[blog_id] || { disabled: true };
          theme.node.embed_status_disabled = block.disabled;
          // console.log("✅ Processed theme:", theme.node.name);
          array.push(theme);
        } catch (parseError) {
          console.warn(`❌ Invalid settings_data.json in theme ${themeId}:`, parseError);
        }
      } else {
        console.warn(`⚠️ No settings_data.json found for theme ${themeId}`);
      }
    }

    // console.log("🎉 Final Array:", array);
    return array;
  } catch (error) {
    console.error("💥 Error in getAppStatus:", error);
    return error.message;
  }
};




// export const app_Status = async (admin, session, block_id, allthemesEC) => {
//   const accessToken = session.accessToken;
//   const shop = session.shop;
//   let resultTheme = null;

//   for (const [index, themeObj] of allthemesEC.entries()) {
//     const themeId = themeObj.node.id.split("/").pop();
//     const response = await fetch(
//       `https://${shop}/admin/api/2024-10/themes/${themeId}/assets.json?asset[key]=config/settings_data.json`,
//       {
//         method: "GET",
//         headers: {
//           "X-Shopify-Access-Token": accessToken,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const json = await response.json();

//     if (json.asset && json.asset.value) {
//       const themeData = JSON.parse(json.asset.value);

//       const blocks = themeData?.current?.blocks || {};
//       const block = blocks[block_id] || { disabled: true };

//       themeObj.node.embed_status_disabled = block.disabled;
//       resultTheme = themeObj;
//     } else {
//       console.warn(`No settings_data.json found for theme ID ${themeId}`);
//       themeObj.node.embed_status_disabled = true; // fallback
//       resultTheme = themeObj;
//     }

//   }

//   console.log("resultTheme", resultTheme);
//   return resultTheme;
// };

// export const app_Status = async (admin, session, theme_id, block_id) => {
//   const accessToken = session.accessToken;
//   const shop = session.shop;

//   try {
//     const response = await fetch(`https://${shop}/admin/api/2024-10/themes/${theme_id}/assets.json?asset[key]=config/settings_data.json`, {
//       method: "GET",
//       headers: {
//         "X-Shopify-Access-Token": accessToken,
//         "Content-Type": "application/json",
//       },
//     });
//     const json = await response.json();

//     let theme = JSON.parse(json.asset.value);
//     if (
//       theme.current.blocks !== undefined &&
//       theme.current.blocks[block_id] !== undefined
//     ) {
//       theme = theme.current.blocks[block_id];
//     } else {
//       theme = { disabled: true };
//     }
//     console.log("themeGQ", theme);
//     return { theme };

//   } catch (error) {
//     // console.error("Error fetching settings_data.json:", error);
//     // return { theme: { disabled: true, error: error.message } };
//   }
// };

const getSettingsData = async (shop, accessToken, themeId) => {
  const res = await fetch(
    `https://${shop}/admin/api/2024-01/themes/${themeId}/assets.json?asset[key]=config/settings_data.json`,
    {
      method: "GET",
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
    }
  );

  const json = await res.json();
  return JSON.parse(json.asset.value);
};

const uploadSettingsData = async (shop, accessToken, themeId, data) => {
  // console.log("data", data);
  // console.log("accessToken", accessToken);
  const body = {
    asset: {
      key: "config/settings_data.json",
      value: JSON.stringify(data, null, 2),
    },
  };
    // console.log("BODY", JSON.stringify(body));

    const res = await fetch(
      `https://${shop}/admin/api/2024-01/themes/${themeId}/assets.json`,
      {
        method: "PUT",
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
  console.log("res", res);
  return await res.json();
};



export const enableAppEmbed = async (shop, accessToken, themeId) => {
  const blockId = '9545152174720515545';
  try {
    const settingsData = await getSettingsData(shop, accessToken, themeId);

    let updated = false;
    for (const key in settingsData?.current?.blocks) {
      const block = settingsData.current.blocks[key];
      console.log("block",block);
      console.log("block.disabled",block.disabled);
      if (block.type.includes('emailcheckr-activation-remix') && block.disabled) {
        block.disabled = false;
        updated = true;
      }
    }

    if (!updated) {
      return {
        status: false,
        message: "No matching block found or already enabled",
        response: JSON.stringify({ status: false, status_code: 404 }),
      };
    }

    const uploadResponse = await uploadSettingsData(
      shop,
      accessToken,
      themeId,
      { data: settingsData }
    );

    return {
      status: true,
      message: "emailcheckr embed block enabled",
      response: JSON.stringify({
        status: true,
        status_code: 200,
        data: uploadResponse,
      }),
    };
  } catch (err) {
    return {
      status: false,
      message: "Failed to enable embed block",
      response: JSON.stringify({
        status: false,
        status_code: 500,
        error: err.message,
      }),
    };
  }
};
