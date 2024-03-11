// External Dependencies
import express, { Request, Response } from "express";
import nodemailer from "nodemailer";
// Global Config
export const emailRouter = express.Router();
emailRouter.use(express.json());

const TEST_EMAIL = "forecommercetest@gmail.com";
const TEST_PASSWORD = "slpy rnyd zfxn prmy";
const CLIENT = "kahn12345678@gmail.com";

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: TEST_EMAIL,
    pass: TEST_PASSWORD,
  },
});

const message = {
  from: "forecommercetest@gmail.com",
  to: "kahn12345678@gmail.com",
  subject: "Thank You for Contacting Millier",
  text: `Dear [User],<br> 
  Thank you for reaching out to us! We appreciate you taking the time to contact [Company Name] and we're excited to assist you with your inquiry.<br>
  Our team has received your message and we will review it promptly. One of our representatives will get back to you as soon as possible, typically within 1-2 business days.<br>
  In the meantime, if you have any urgent concerns or questions, please feel free to contact us directly at [Contact Number] or reply to this email.<br>
  Once again, thank you for choosing [Company Name]. We look forward to serving you!<br>
  Best regards,<br>Millier`,
  html: `
  <p>Dear [User],</p>
  <p>Thank you for reaching out to us! We appreciate you taking the time to contact [Company Name] and we're excited to assist you with your inquiry.</p>
  <p>Our team has received your message and we will review it promptly. One of our representatives will get back to you as soon as possible, typically within 1-2 business days.</p>
  <p>In the meantime, if you have any urgent concerns or questions, please feel free to contact us directly at [Contact Number] or reply to this email.</p>
  <p>Once again, thank you for choosing [Company Name]. We look forward to serving you!</p>
  <p>Best regards,<br>Millier</p>`,
};

// GET
emailRouter.get("/sendEmail", async (req: Request, res: Response) => {
  try {
    const info = await transporter.sendMail(message);
    res.status(200).send(info);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});
// POST
// PUT
// DELETE
