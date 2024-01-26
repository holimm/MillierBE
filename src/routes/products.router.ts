// External Dependencies
import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";
import { ProductsModel } from "../models/products";
// Global Config
export const productsRouter = express.Router();
productsRouter.use(express.json());
// GET
productsRouter.get("/", async (req: Request, res: Response) => {
  try {
    const query: any = {};
    if (req.query.name)
      query["$or"] = [
        {
          name: {
            $regex: new RegExp(`${req.query.name}`.replace(/\s/g, ""), "i"),
          },
        },
        {
          key: {
            $regex: new RegExp(`${req.query.name}`.replace(/\s/g, ""), "i"),
          },
        },
      ];
    const result = (await collections
      .products!.find(query)
      .toArray()) as unknown as ProductsModel[];
    res.status(200).send(result);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});
productsRouter.get("/:id", async (req: Request, res: Response) => {
  const id = req?.params?.id;
  try {
    const query = { _id: new ObjectId(id) };
    const result = (await collections.products!.findOne(
      query
    )) as unknown as ProductsModel[];

    if (result) {
      res.status(200).send(result);
    }
  } catch (error) {
    res
      .status(404)
      .send(`Unable to find matching document with id: ${req.params.id}`);
  }
});
// POST
productsRouter.post("/", async (req: Request, res: Response) => {
  try {
    const newGame = req.body as ProductsModel;
    const result = await collections.products!.insertOne(newGame);

    result
      ? res
          .status(201)
          .send(`Successfully created a new game with id ${result.insertedId}`)
      : res.status(500).send("Failed to create a new game.");
  } catch (error) {
    console.error(error);
    res.status(400).send("Error");
  }
});
// PUT

// DELETE
