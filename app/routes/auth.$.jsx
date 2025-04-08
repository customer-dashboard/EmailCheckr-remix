import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  console.log("In auth.jsx file");
  await authenticate.admin(request);

  return null;
};
