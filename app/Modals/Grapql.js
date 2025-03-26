import {billingConfig} from "../../app/routes/billing"

export async function getStoreLanguages(graphql){
    const locals = await graphql(
        `query {
            shopLocales {
                locale
                name
                primary
                published
            }
            }`,
      );
    const response = await locals.json();
    return response;
}

export async function postLocal(graphql,new_data){
  let shopLocal = [];
  const query = await graphql(
    `query {
        shopLocales {
            locale
            name
            primary
            published
        }
        }`,
  );
const response = await query.json();
// console.log("lang",response);
shopLocal = response?.data?.shopLocales;
shopLocal.forEach(element => {
    let local_obj=element.name.toLowerCase();
    new_data.translation[local_obj]=new_data.translation[local_obj]?new_data.translation[local_obj]:new_data.translation.english
  });
  return new_data;
} 

export async function getStoreThemes(graphql){
    const themes = await graphql(
        `query {
            themes(first: 20) {
                edges {
                node {
                    name
                    id
                    role
                }
                }
            }
            }`,
      );
    const response = await themes.json();
    return response;
}

export async function setTranslation(admin,formValue,shop,accessToken){
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
          "metafields": [
            {
              "key": "Translations",
              "namespace": "customer_accounts_email_verification",
              "ownerId": shopGid,
              "type": "multi_line_text_field",
              "value": formdata
            }
          ]
        },
      },
    );
   
      const response = await translations.json();
      return response;
    } catch (error) {
      console.error("Error in setTranslation:", error);
      throw error; 
    }
}

export async function getTranslation(admin){
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
    }`);
  const response = await get_meta.json();
  return response;
}

export async function deleteMetafields(admin,shop,accessToken){
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
        "metafields": [
          {
            "namespace": "customer_accounts_email_verification",
            "ownerId": shopGid,
            "key": "Settings"
          }
        ]
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

export async function postMetafileds(admin,formValue,shop,accessToken){
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
          "metafields": [
            {
              "key": "Settings",
              "namespace": "customer_accounts_email_verification",
              "ownerId": shopGid,
              "type": "multi_line_text_field",
              "value": formDatavalue
            }
          ]
        },
      },
    );
    
      const response = await metafileds.json();
      return response;
    } catch (error) {
      console.error("Error in setTranslation:", error);
      throw error; 
    }
}

export async function getSettings(admin){
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
      }`
    );
    const response = await get_setting.json();
    // const data = response.data.shop.metafields.edges;
    const metafields = response?.data?.shop?.metafields?.edges;

    // Filter metafields by key
    const keyName = "Settings"; 
    const targetMetafield = metafields.find((edge) => edge.node.key === keyName);
    return targetMetafield ? targetMetafield?.node?.value : null;
  } catch (error) {
    console.error("Error fetching settings:", error);
    return null; 
  }
}  

export async function getbilling(session,billing){
  let plans = Object.keys(billingConfig);
  for (let index = 0; index < plans.length; index++) {
    const element = plans[index];
    console.log("element", element);
    const hasPayment = await hasBillingCheck(session,billing,element);
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
    const response = await fetch(`https://${shop}/admin/api/2023-07/customers/search.json?query=email:${reqbody.email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },
    });

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
  try {
    const url = `https://${shop}/admin/api/2025-01/customers.json`;
    const tags = reqbody?.tags?"EmailCheckrSubscriber,"+reqbody.tags:"EmailCheckrSubscriber";
    const requestbody = { 
      customer: { 
        first_name: reqbody.first_name, 
        last_name: reqbody.last_name, 
        email: reqbody.email,
        tags : tags,
        verified_email : true,
        send_email_welcome : false,
        send_email_invite : true
        // if (reqbody.accepts_marketing) {
        //   customer.email_marketing_consent = {
        //     state: "subscribed",
        //     opt_in_level: "single_opt_in",
        //   };
        // }
      }
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
      throw new Error(`Shopify API Error: ${errorResponse.errors || response.statusText}`);
    }

    const data = await response.json();
    
    console.log("Customer Created:", data);
    return data;
  } catch (error) {
    console.error("Error posting profile data:", error.message);
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
    query: `customer_account_status = '${status}' AND customer_tags CONTAINS 'EmailCheckrSubscriber'`
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const result = await response.json();

    if (!response.ok || result.errors) {
      throw new Error(result.errors?.[0]?.message || 'Failed to create segment');
    }
    
    const userErrors = result.data.segmentCreate.userErrors;
    
    if (userErrors.length > 0) {
      console.error('Segment creation failed with errors:', userErrors);
      return { error: userErrors };
    }
    
    return result.data.segmentCreate.segment.id;
  } catch (error) {
    return { error: error.message };
  }
}
    
export async function hasBillingCheck(session,billing,name){
  // let isTest = false;
  // if (session.shop === "silver-heritage-heaven.myshopify.com"||session.shop === "my-public-app.myshopify.com") {
  //   isTest=true;
  // }
  // console.log("session", session);
  // console.log("billing", billing);
  var newShop = session.shop;
  var shop = newShop.replace(".myshopify.com", "");
  return await billing.require({
    plans: Object.keys(billingConfig),
    isTest: true,
    returnObject: true,
    onFailure: async () => billing.request({
      plan: name,
      isTest: true,
        returnUrl:`https://admin.shopify.com/store/${shop}/apps/email-checkr/app`,
    }),
  });
}

export async function hasBillingRequest(session,billing,name){
// let isTest = false;
// if (session.shop === "silver-heritage-heaven.myshopify.com"||session.shop === "my-public-app.myshopify.com") {
//   isTest=true;
// }
var newShop = session.shop;
var shop = newShop.replace(".myshopify.com", "");
return await billing.require({
  plans: Object.keys(billingConfig),
  isTest: true,
  returnObject: true,
  onFailure: async () => billing.request({
    plan: name,
    isTest: true,
      returnUrl:`https://admin.shopify.com/store/${shop}/apps/email-checkr/app`,
  }),
});
}



export async function getCustomersData(shop,accessToken,state = null){
  const baseUrl = `https://${shop}/admin/api/2023-10`;
  const headers = {
    'Content-Type': 'application/json',
    'X-Shopify-Access-Token': accessToken,
  };

  if (state === 'count') {
    const response = await fetch(`${baseUrl}/customers/count.json`, {
      method: 'GET',
      headers,
    });
    const data = await response.json();
    return data.count;
  }

  let endpoint = `${baseUrl}/customers.json`;
  if (state) {
    endpoint += `?state=${state}`;
  }

  const response = await fetch(endpoint, {
    method: 'GET',
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
data = local.data.shopLocales.filter(element => element.locale==data);
return data;
}
