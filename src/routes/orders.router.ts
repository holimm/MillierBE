// External Dependencies
import express, { Request, Response } from "express";
import { collections } from "../services/database.service";
import { OrderInformationType } from "../models/orders";
// Global Config
export const ordersRouter = express.Router();
ordersRouter.use(express.json());
// GET
ordersRouter.get(
  "/getOrdersByAccountId/:id",
  async (req: Request, res: Response) => {
    try {
      const accountID = req.params.id;
      const query: any = {
        accountID: accountID,
      };
      const result = (await collections
        .orders!.find(query)
        .toArray()) as unknown as OrderInformationType[];
      res.status(200).send(result);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }
);
// POST
ordersRouter.post("/create", async (req: Request, res: Response) => {
  try {
    const checkoutInformationData: OrderInformationType =
      req.body as OrderInformationType;
    const resultCreateOrder = await collections.orders!.insertOne(
      checkoutInformationData
    );
    resultCreateOrder
      ? res.status(200).send({
          status: "success",
          data: "Successfully created new address information",
        })
      : res.status(304).send({
          status: "error",
          data: "Address information not created",
        });
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

// PUT
// DELETE
