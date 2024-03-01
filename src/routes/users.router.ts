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
    const resultUser = (await collections.users!.findOne({
      username: req.body.username,
    })) as unknown as UsersModel;
    if (!isEmpty(resultUser)) {
      bcrypt.compare(req.body.password, resultUser.password).then((result) => {
        if (result) {
          res.status(200).send({
            status: "success",
            data: { ...resultUser, remember: req.body.remember },
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

usersRouter.post("/createAddress/:id", async (req: Request, res: Response) => {
  const id = req?.params?.id;
  try {
    const addressCreateData: UsersAddressUpdateModel =
      req.body as UsersAddressUpdateModel;
    const query = { _id: new ObjectId(id) };
    const resultCreateAddress = await collections.users!.updateOne(query, {
      $push: {
        address: addressCreateData,
      },
    });
    resultCreateAddress
      ? res.status(200).send({
          status: "success",
          data: "Successfully created new address information",
        })
      : res.status(304).send({
          status: "error",
          data: "Address information not created",
        });
  } catch (error: any) {
    console.error(error.message);
    res.status(400).send(error.message);
  }
});

usersRouter.get("/sessionSignIn", async (req: Request, res: Response) => {
  try {
    let [scheme, token]: any = req.headers.authorization?.split(" ");
    switch (scheme) {
      case "Bearer":
        const resultUser = (await collections.users!.findOne({
          token: token,
        })) as unknown as UsersModel[];
        res.status(200).send({
          status: "success",
          data: resultUser,
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
usersRouter.put("/updatePassword/:id", async (req: Request, res: Response) => {
  const id = req?.params?.id;
  try {
    const passwordUpdate: UsersPasswordUpdateModel =
      req.body as UsersPasswordUpdateModel;
    const query = { _id: new ObjectId(id) };

    const resultUser = (await collections.users!.findOne(
      query
    )) as unknown as UsersModel;

    if (!isEmpty(resultUser)) {
      bcrypt
        .compare(passwordUpdate.old_password, resultUser.password)
        .then(async (result) => {
          if (result) {
            const resultUpdatePassword = await collections.users!.updateOne(
              query,
              {
                $set: {
                  password: await bcrypt.hash(passwordUpdate.new_password, 14),
                },
              }
            );
            resultUpdatePassword
              ? res.status(200).send({
                  status: "success",
                  data: "Successfully updated password",
                })
              : res.status(304).send({
                  status: "error",
                  data: "Password not updated",
                });
          } else {
            res.status(200).send({
              status: "error",
              data: "Incorrect old password",
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
    console.error(error.message);
    res.status(400).send(error.message);
  }
});
usersRouter.put(
  "/updateInformation/:id",
  async (req: Request, res: Response) => {
    const id = req?.params?.id;
    try {
      const informationUpdate: UsersInformationUpdateModel =
        req.body as UsersInformationUpdateModel;
      const query = { _id: new ObjectId(id) };
      const resultUpdateInformation = await collections.users!.updateOne(
        query,
        {
          $set: informationUpdate,
        }
      );
      resultUpdateInformation
        ? res.status(200).send({
            status: "success",
            data: "Successfully updated personal information",
          })
        : res.status(304).send({
            status: "error",
            data: "Personal information not updated",
          });
    } catch (error: any) {
      console.error(error.message);
      res.status(400).send(error.message);
    }
  }
);
usersRouter.put("/updateAddress/:id", async (req: Request, res: Response) => {
  const id = req?.params?.id;
  try {
    const { index, ...informationUpdate }: UsersAddressUpdateModel =
      req.body as UsersAddressUpdateModel;

    const query = { _id: new ObjectId(id) };
    const resultUpdateAddress = await collections.users!.updateOne(query, {
      $set: {
        [`address.${index}`]: informationUpdate,
      },
    });
    resultUpdateAddress
      ? res.status(200).send({
          status: "success",
          data: "Successfully updated address information",
        })
      : res.status(304).send({
          status: "error",
          data: "Address information not updated",
        });
  } catch (error: any) {
    console.error(error.message);
    res.status(400).send(error.message);
  }
});
usersRouter.put("/deleteAddress/:id", async (req: Request, res: Response) => {
  const id = req?.params?.id;
  try {
    const { index, ...informationUpdate }: UsersAddressUpdateModel =
      req.body as UsersAddressUpdateModel;

    const query = { _id: new ObjectId(id) };
    const resultSetNullAddress = await collections.users!.updateOne(query, {
      $unset: {
        [`address.${index}`]: 1,
      },
    });
    const resultUpdateAddress = await collections.users!.updateOne(query, {
      $pull: {
        address: null,
      },
    });
    resultUpdateAddress
      ? res.status(200).send({
          status: "success",
          data: "Successfully deleted address information",
        })
      : res.status(304).send({
          status: "error",
          data: "Address information not deleted",
        });
  } catch (error: any) {
    console.error(error.message);
    res.status(400).send(error.message);
  }
});
// DELETE
