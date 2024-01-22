// External Dependencies
import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";
import ProductsDetailModel from "../models/productsdetail";
// Global Config
export const productsDetailRouter = express.Router();
productsDetailRouter.use(express.json());
// GET
productsDetailRouter.get("/", async (_req: Request, res: Response) => {
  try {
    const result = (await collections
      .productsdetail!.find({})
      .toArray()) as unknown as ProductsDetailModel[];

    res.status(200).send(result);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});
productsDetailRouter.get("/:id", async (req: Request, res: Response) => {
  const id = req?.params?.id;
  try {
    const query = { _id: new ObjectId(id) };
    const result = (await collections.productsdetail!.findOne(
      query
    )) as unknown as ProductsDetailModel[];

    if (result) {
      res.status(200).send({
        status: "success",
        data: result,
      });
    }
  } catch (error) {
    res.status(404).send({
      status: "Unable to find matching document",
      data: null,
    });
  }
});
// POST
productsDetailRouter.post("/", async (req: Request, res: Response) => {
  try {
    const newGame = req.body as ProductsDetailModel;
    const result = await collections.productsdetail!.insertOne(newGame);

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
