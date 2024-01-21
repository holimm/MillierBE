// External Dependencies
import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";
import ProductsModel from "../models/products";
// Global Config
export const productsRouter = express.Router();
productsRouter.use(express.json());
// GET
productsRouter.get("/", async (_req: Request, res: Response) => {
  try {
    const result = (await collections
      .products!.find({})
      .toArray()) as unknown as ProductsModel[];

    res.status(200).send(result);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});
// POST

// PUT

// DELETE
