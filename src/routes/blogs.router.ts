// External Dependencies
import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";
import { ProductsModel } from "../models/products";
import { BlogModel } from "../models/blogs";
// Global Config
export const blogsRouter = express.Router();
blogsRouter.use(express.json());
// GET
blogsRouter.get("/", async (req: Request, res: Response) => {
  try {
    const query: any = {};
    if (req.query.category) query["category"] = req.query.category;
    const result = (await collections
      .blogs!.find(query)
      .toArray()) as unknown as BlogModel[];
    res.status(200).send({
      status: "success",
      data: result,
    });
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});
blogsRouter.get("/:idTitle", async (req: Request, res: Response) => {
  const idTitle = req?.params?.idTitle;
  try {
    const query = { idTitle: idTitle };
    const result = (await collections.blogs!.findOne(
      query
    )) as unknown as BlogModel;
    if (result) {
      res.status(200).send({
        status: "success",
        data: result,
      });
    } else {
      res.status(200).send({
        status: "error",
        data: "Order not cancelled",
      });
    }
  } catch (error) {
    res
      .status(404)
      .send(`Unable to find matching document with id: ${req.params.id}`);
  }
});
// POST
// PUT
// DELETE
