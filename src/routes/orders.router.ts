// External Dependencies
import express, { Request, Response } from "express";
import { collections } from "../services/database.service";
import { OrderInformationType } from "../models/orders";
import { ObjectId } from "mongodb";
import dayjs from "dayjs";
import { sendEmailRegisterAccount } from "../helpers/sendEmail";
import { NumberToDollarFormat } from "../helpers/commonHelpers";
import { first } from "lodash";
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
ordersRouter.get(
  "/getTrackingOrder/:id/:email",
  async (req: Request, res: Response) => {
    try {
      const orderID = req.params.id;
      const emailAccount = req.params.email;
      const query: any = {
        $and: [{ _id: new ObjectId(orderID) }, { email: emailAccount }],
      };
      const result = (await collections.orders!.findOne(
        query
      )) as unknown as OrderInformationType[];
      result
        ? res.status(200).send(result)
        : res.status(200).send("No order existed in database");
    } catch (error: any) {
      res.status(500).send("No order existed in database");
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
    if (resultCreateOrder) {
      await sendEmailRegisterAccount({
        to: checkoutInformationData.email,
        subject: "Order Confirmation: Your Purchase is Complete!",
        text: `Dear ${checkoutInformationData.email},<br>
          Congratulations! Your order has been successfully placed with Millier. We're excited to confirm that your purchase has been processed and is now being prepared for shipment.<br> 
          Here's a summary of your order:<br>
          <b>Order Number:</b> ${resultCreateOrder.insertedId}<br>
          <b>Date of Purchase:</b> ${dayjs(
            first(checkoutInformationData.date)?.dateString
          )}<br>
          <b>Total Amount:</b> ${NumberToDollarFormat(
            checkoutInformationData.total
          )}<br>
          <b>Shipping Address:</b> [${checkoutInformationData.address?.type}] ${
          checkoutInformationData.address?.street
        }, Ward ${checkoutInformationData.address?.ward}, District ${
          checkoutInformationData.address?.district
        }, ${checkoutInformationData.address?.city}<br>
        <b>Track your order:</b> http://localhost:3034/track-order?code=${
          resultCreateOrder.insertedId
        }&email=${checkoutInformationData.email}<br>
          Thank you for choosing Millier for your purchase. We appreciate your business and look forward to serving you again in the future!<br>
          Best regards,<br>Millier`,
        html: `
          <p>Dear ${checkoutInformationData.email},</p>
          <p>Congratulations! Your order has been successfully placed with Millier. We're excited to confirm that your purchase has been processed and is now being prepared for shipment.</p>
          <p>Here's a summary of your order:</p>
          <p><b>Order Number:</b> ${resultCreateOrder.insertedId}</p>
          <p><b>Date of Purchase:</b> ${dayjs(
            first(checkoutInformationData.date)?.dateString
          )}</p>
          <p><b>Total Amount:</b> ${NumberToDollarFormat(
            checkoutInformationData.total
          )}</p>
          <p><b>Shipping Address:</b> [${
            checkoutInformationData.address?.type
          }] ${checkoutInformationData.address?.street}, Ward ${
          checkoutInformationData.address?.ward
        }, District ${checkoutInformationData.address?.district}, ${
          checkoutInformationData.address?.city
        }</p>
          <p><a href="http://localhost:3034/track-order?code=${
            resultCreateOrder.insertedId
          }&email=${checkoutInformationData.email}">Track Order Link</a></p>
          <p>Thank you for choosing Millier for your purchase. We appreciate your business and look forward to serving you again in the future!</p>
          <p>Best regards,<br>Millier</p>`,
      });
      res.status(200).send({
        status: "success",
        data: "Successfully created new order",
      });
    } else {
      res.status(304).send({
        status: "error",
        data: "Order not created",
      });
    }
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

// PUT
ordersRouter.put("/cancelOrder/:id", async (req: Request, res: Response) => {
  try {
    const { idOrder }: { idOrder: string } = req.body as { idOrder: string };
    const query = { _id: new ObjectId(idOrder) };
    const resultUpdateAddress = await collections.orders!.updateOne(query, {
      $push: {
        [`date`]: {
          id: "dateCancelled",
          dateString: dayjs().format(),
        },
      },
      $set: {
        status: "Cancelled",
      },
    });
    resultUpdateAddress
      ? res.status(200).send({
          status: "success",
          data: "Successfully cancelled order",
        })
      : res.status(304).send({
          status: "error",
          data: "Order not cancelled",
        });
  } catch (error: any) {
    console.error(error.message);
    res.status(400).send(error.message);
  }
});
// DELETE
