import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";
import { connectToDatabase } from "./services/database.service";
import { usersRouter } from "./routes/users.router";
import { productsRouter } from "./routes/products.router";

const app = express();
const cors = require("cors");

connectToDatabase()
  .then(() => {
    app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      next();
    });
    app.use("/users", usersRouter);
    app.use("/products", productsRouter);
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
