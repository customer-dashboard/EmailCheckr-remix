import { json } from "@remix-run/node";
import { GetMongoData, InsertUpdateData, DeleteSingleData } from "./mongodb";

export const loader = async () => {
  const data = await GetMongoData("comments"); 
  return json({ data });
};

export const action = async ({ request }) => {
  const { method } = request;
  const body = await request.json();

  if (method === "POST") {
    // Insert or Update data
    const response = await InsertUpdateData(body.data, "comments", body.find);
    return json(response);
  }

  if (method === "DELETE") {
    // Delete data
    const response = await DeleteSingleData("comments", body.find);
    return json(response);
  }

  return json({ error: "Invalid request method" }, { status: 405 });
};


