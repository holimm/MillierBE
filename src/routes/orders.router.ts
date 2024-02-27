// External Dependencies
import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";
import {
  UsersAddressUpdateModel,
  UsersInformationUpdateModel,
  UsersModel,
  UsersPasswordUpdateModel,
} from "../models/users";
import bcrypt from "bcrypt";
import { isEmpty, result } from "lodash";
// Global Config
export const ordersRouter = express.Router();
ordersRouter.use(express.json());
// GET
ordersRouter.get("/", async (req: Request, res: Response) => {
  try {
    const result = (await collections
      .users!.find({ username: req.query.username })
      .toArray()) as unknown as UsersModel[];

    console.log(result);
    res.status(200).send(result);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});
// POST
ordersRouter.post("/create", async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    res.status(200).send(req.body);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

// PUT
// DELETE
