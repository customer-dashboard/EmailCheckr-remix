import { MongoClient, ServerApiVersion } from "mongodb";

const uri = "mongodb+srv://emailCheckr:12345@cluster0.z1pwf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const mongoclient = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const Connection = async (collectionName)=>{
  await mongoclient.connect();
  const dbName = "sample_mflix";
  const database = mongoclient.db(dbName);
  return database.collection(collectionName);
}


// export async function GetCollectionMongoDB(collectionName) {
//   try {
//     const collection = await Connection(collectionName);
//     try {
//       return await collection.find({}).limit(10).toArray();
//     } catch (err) {
//     console.error(`Something went wrong trying to find one document: ${err}\n`);
//     }
//     // const findOneQuery = { shop: shop };
//     // try {
//     //  return await collection.findOne(findOneQuery);
//     // } catch (err) {
//     // console.error(`Something went wrong trying to find one document: ${err}\n`);
//     // }
//   } finally {
//   }
// }

export async function GetCollectionMongoDB(Collection,shop) {
  try {
    let collectionName = Collection;
    const collection = await Connection(collectionName);
    const findOneQuery = { shop: shop };
    try {
    const findOneResult = await collection.findOne(findOneQuery);
    if (findOneResult === null) {
      return JSON.stringify("");
    } else {
      return JSON.stringify(findOneResult);
    }
    } catch (err) {
    console.error(`Something went wrong trying to find one document: ${err}\n`);
    }
  } finally {
    // Ensures that the client will close when you finish/error
    // await mongoclient.close();
  }
}


// Fetch all data (Read)
export const GetMongoData = async (collectionName) => {
  const collection = await Connection(collectionName);
  return await collection.find({}).limit(10).toArray(); 
};

// Insert or Update data
// export const InsertUpdateData = async (data, collectionName, find) => {
//   if (!find || typeof find !== 'object') {
//     throw new Error("Invalid 'find' parameter. It must be a plain object.");
//   }
//   const collection = await Connection(collectionName);
//   const existing = await collection.findOne(find);
//   if (!existing) {
//     await collection.insertOne(data);
//     return { message: "Inserted successfully" };
//   } else {
//     await collection.updateOne(find, { $set: data });
//     return { message: "Updated successfully" };
//   }
// };
export const InsertUpdateData = async (shop, data, collectionName) => {
  try {
    const collection = await Connection(collectionName);

    const filter = { shop }; // Use shop as unique identifier in the filter
    const update = { $set: { ...data, shop } }; // Add shop as a field in the data
    const options = { upsert: true }; // Insert if doesn't exist, else update

    const result = await collection.updateOne(filter, update, options);
// console.log("result", result);
    if (result.upsertedCount > 0) {
      return { message: 'Inserted successfully', upsertedId: result.upsertedId };
    } else if (result.modifiedCount > 0) {
      return { message: 'Updated successfully' };
    } else {
      return { message: 'No changes made' };
    }
  } catch (error) {
    console.error('MongoDB Error:', error);
    return { error: error.message };
  }
};



// Delete data
export const DeleteSingleData = async (collectionName, find) => {
  const collection = await Connection(collectionName);
  // console.log("Collection Methods:", collection, find);
  await collection.deleteOne(find);
  return { message: "Deleted successfully" };
};

export async function MongoDB(data,Collection,stt) {
  const alldata = data;
  const shop = {shop:alldata.shop};
    await mongoclient.connect();
    const dbName = "sample_mflix";
    var collectionName = Collection;
    const database = mongoclient.db(dbName);
    const collection = database.collection(collectionName);
    try {
      const findOneResult = await collection.findOne(shop);
        if (findOneResult === null) {
          await collection.insertOne(alldata);
          return {message: "success"};
        } 
        else if(stt&&stt === 1){
          return true;
        }
        else {
          var newvalues = { $set:alldata};
          await collection.updateOne(shop, newvalues);
          return {message: "success"};
        }
    } catch (err) {
      return `Something went wrong trying to insert the new documents: ${err}\n`;
    }
}

// export const hasBillingCheck = async (shopify,session,plans) =>{
// let isTest = false;
// if (session.shop === "my-public-app.myshopify.com"||session.shop === "publicapp.myshopify.com") {
//   isTest=true;
// }
// return await shopify.api.billing.check({
//   session,
//   plans:[plans],
//   isTest: isTest,
//   returnObject: true
// });
// }

// export const hasBillingRequest = async (shopify,session,plan) =>{
//   let isTest = false;
//   if (session.shop === "my-public-app.myshopify.com"||session.shop === "publicapp.myshopify.com") {
//     isTest=true;
//   }
//   return await shopify.api.billing.request({session,plan,isTest:isTest});
//   }
