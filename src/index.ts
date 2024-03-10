import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";
import { connectToDatabase } from "./services/database.service";
import { usersRouter } from "./routes/users.router";
import { productsRouter } from "./routes/products.router";
import { productsDetailRouter } from "./routes/productsdetail.router";
import { categoryRouter } from "./routes/category.router";
import { ordersRouter } from "./routes/orders.router";
import { emailRouter } from "./routes/email.router";
import { blogsRouter } from "./routes/blogs.router";
import { contactsRouter } from "./routes/contacts.router";

const app = express();
const cors = require("cors");

connectToDatabase()
  .then(() => {
    app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
      );
      res.header("Access-Control-Allow-Methods", "POST, PUT, GET, OPTIONS");
      next();
    });
    app.use("/api/users", usersRouter);
    app.use("/api/orders", ordersRouter);
    app.use("/api/products", productsRouter);
    app.use("/api/category", categoryRouter);
    app.use("/api/productsDetail", productsDetailRouter);
    app.use("/api/email", emailRouter);
    app.use("/api/blogs", blogsRouter);
    app.use("/api/contacts", contactsRouter);
    app.use(bodyParser.json());
    app.use(cors());
    app.use(express.static("public"));
    app.use("/images", express.static("images"));
    app.listen(process.env.PORT, () => {
      console.log(`Server started at http://localhost:${process.env.PORT}`);
    });
    app.use(cors());
  })
  .catch((error: Error) => {
    console.error("Database connection failed", error);
    process.exit();
  });
export const collections: { games?: mongoDB.Collection } = {};
