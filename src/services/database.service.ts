// External Dependencies
import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";
// Global Variables

export const collections: {
  users?: mongoDB.Collection;
  orders?: mongoDB.Collection;
  products?: mongoDB.Collection;
  productsdetail?: mongoDB.Collection;
  category?: mongoDB.Collection;
  blogs?: mongoDB.Collection;
  contacts?: mongoDB.Collection;
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
  const ordersCollection: mongoDB.Collection = db.collection("orders");
  const productsCollection: mongoDB.Collection = db.collection("products");
  const categoryCollection: mongoDB.Collection = db.collection("category");
  const productsDetailCollection: mongoDB.Collection =
    db.collection("productsdetail");
  const blogsCollection: mongoDB.Collection = db.collection("blogs");
  const contactsCollection: mongoDB.Collection = db.collection("contacts");
  collections.users = usersCollection;
  collections.orders = ordersCollection;
  collections.products = productsCollection;
  collections.productsdetail = productsDetailCollection;
  collections.category = categoryCollection;
  collections.blogs = blogsCollection;
  collections.contacts = contactsCollection;
  console.log(`Successfully connected to database: ${db.databaseName}`);
};
