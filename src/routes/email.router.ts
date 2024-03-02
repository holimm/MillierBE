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
  subject: "Millier Email Verification",
  text: `Hello, Thank you for signing up with our service!<br> 
  To complete your registration, please verify your email address by clicking the link below:<br>
  Verification Link: http://localhost:3034/verify-email<br>
  If you did not sign up for our service, you can safely ignore this email.<br>
  Best regards,<br>Millier`,
  html: `
  <p>Hello,</p>
  <p>Thank you for signing up with our service! To complete your registration, please verify your email address by clicking the link below:</p>
  <p><a href="http://localhost:3034/verify-email">Verification Link</a></p>
  <p>If you did not sign up for our service, you can safely ignore this email.</p>
  <p>Best regards,<br>Millier</p>`,
};

// GET
emailRouter.get("/sendEmail", async (req: Request, res: Response) => {
  try {
    console.log("RECEIVED");
    const info = await transporter.sendMail(message);
    res.status(200).send(info);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});
// POST
// PUT
// DELETE
