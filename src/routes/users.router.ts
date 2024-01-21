// External Dependencies
import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";
import UsersModel from "../models/users";
// Global Config
export const usersRouter = express.Router();
usersRouter.use(express.json());
// GET
usersRouter.get("/", async (_req: Request, res: Response) => {
  try {
    const result = (await collections
      .users!.find({})
      .toArray()) as unknown as UsersModel[];

    res.status(200).send(result);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});
// POST

// PUT

// DELETE
