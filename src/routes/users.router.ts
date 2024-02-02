// External Dependencies
import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";
import UsersModel from "../models/users";
import bcrypt from "bcrypt";
import { isEmpty } from "lodash";
// Global Config
export const usersRouter = express.Router();
usersRouter.use(express.json());
// GET
usersRouter.get("/", async (req: Request, res: Response) => {
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
usersRouter.post("/signin", async (req: Request, res: Response) => {
  try {
    const resultUser = (await collections
      .users!.find({
        username: req.body.username,
      })
      .toArray()) as unknown as UsersModel[];
    if (!isEmpty(resultUser)) {
      bcrypt
        .compare(req.body.password, resultUser[0].password)
        .then((result) => {
          if (result) {
            res.status(200).send({
              status: "success",
              data: resultUser[0],
            });
          } else {
            res.status(200).send({
              status: "error",
              data: "Wrong username or password",
            });
          }
        });
    } else {
      res.status(200).send({
        status: "error",
        data: "User not found",
      });
    }
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

usersRouter.get("/sessionSignIn", async (req: Request, res: Response) => {
  try {
    let [scheme, token]: any = req.headers.authorization?.split(" ");
    switch (scheme) {
      case "Bearer":
        const resultUser = (await collections
          .users!.find({
            token: token,
          })
          .toArray()) as unknown as UsersModel[];
        res.status(200).send({
          status: "success",
          data: resultUser[0],
        });
        break;
    }
    // res.status(200).send("Test");
  } catch (error: any) {
    console.log(error);
    res.status(500).send(error.message);
  }
});
// PUT

// DELETE
