// External Dependencies
import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";
// Global Variables

export const collections: {
  users?: mongoDB.Collection;
  products?: mongoDB.Collection;
  productsdetail?: mongoDB.Collection;
  category?: mongoDB.Collection;
} = {};
// Initialize Connection
export const connectToDatabase = async () => {
  dotenv.config();
  const client: mongoDB.MongoClient = new mongoDB.MongoClient(
    process.env.MONGODB_URI!
  );
  await client.connect();
  const db: mongoDB.Db = client.db(process.env.MONGODB_DATABASE!);
  const usersCollection: mongoDB.Collection = db.collection("users");
  const productsCollection: mongoDB.Collection = db.collection("products");
  const categoryCollection: mongoDB.Collection = db.collection("category");
  const productsDetailCollection: mongoDB.Collection =
    db.collection("productsdetail");
  collections.users = usersCollection;
  collections.products = productsCollection;
  collections.productsdetail = productsDetailCollection;
  collections.category = categoryCollection;

  console.log(`Successfully connected to database: ${db.databaseName}`);
};
