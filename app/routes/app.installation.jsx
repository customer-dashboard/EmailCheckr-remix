import { useLoaderData } from '@remix-run/react';
import InstallApp from '../components/InstallApp';
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const { shop } = session;
  let myShop = shop.replace(".myshopify.com", "");
  return { myShop }; 
};

export default function Installation() {
  const { myShop } = useLoaderData(); 
  return <InstallApp shop={myShop} />;
}