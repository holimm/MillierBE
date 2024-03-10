// External Dependencies
import express, { Request, Response } from "express";
import { collections } from "../services/database.service";
import { OrderInformationType } from "../models/orders";
import { ObjectId } from "mongodb";
import dayjs from "dayjs";
import { sendEmailRegisterAccount } from "../helpers/sendEmail";
import { ContactNodeModel } from "../models/contacts";
// Global Config
export const contactsRouter = express.Router();
contactsRouter.use(express.json());
// GET
// POST
contactsRouter.post("/create", async (req: Request, res: Response) => {
  try {
    const contactNodeData: ContactNodeModel = req.body as ContactNodeModel;
    const isSentEmail = await sendEmailRegisterAccount({
      to: contactNodeData.email,
      subject: "Thank You for Contacting Millier",
      text: `Dear ${contactNodeData.fullname},<br> 
      Thank you for reaching out to us! We appreciate you taking the time to contact Millier and we're excited to assist you with your inquiry.<br>
      Our team has received your message and we will review it promptly. One of our representatives will get back to you as soon as possible, typically within 1-2 business days.<br>
      In the meantime, if you have any urgent concerns or questions, please feel free to contact us directly at +1 (555) 555-5555 or reply to this email.<br>
      Once again, thank you for choosing Millier. We look forward to serving you!<br>
      Best regards,<br>Millier`,
      html: `
      <p>Dear ${contactNodeData.fullname},</p>
      <p>Thank you for reaching out to us! We appreciate you taking the time to contact Millier and we're excited to assist you with your inquiry.</p>
      <p>Our team has received your message and we will review it promptly. One of our representatives will get back to you as soon as possible, typically within 1-2 business days.</p>
      <p>In the meantime, if you have any urgent concerns or questions, please feel free to contact us directly at +1 (555) 555-5555 or reply to this email.</p>
      <p>Once again, thank you for choosing Millier. We look forward to serving you!</p>
      <p>Best regards,<br>Millier</p>`,
    });
    const resultCreateContactNode = await collections.contacts!.insertOne(
      contactNodeData
    );
    resultCreateContactNode && isSentEmail
      ? res.status(200).send({
          status: "success",
          data: "Successfully created new contact node",
        })
      : res.status(200).send({
          status: "error",
          data: "Contact node not created",
        });
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

// PUT

// DELETE
