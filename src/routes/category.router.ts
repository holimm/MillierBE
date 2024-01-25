// External Dependencies
import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";
import { CategoryModel } from "../models/products";
// Global Config
export const categoryRouter = express.Router();
categoryRouter.use(express.json());
// GET
categoryRouter.get("/", async (req: Request, res: Response) => {
  try {
    const result = (await collections
      .category!.find({})
      .toArray()) as unknown as CategoryModel[];
    res.status(200).send(result);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});
// POST
// PUT

// DELETE
