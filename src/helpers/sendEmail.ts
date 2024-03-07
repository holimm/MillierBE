// External Dependencies
import express, { Request, Response } from "express";
import nodemailer from "nodemailer";

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

export const sendEmailRegisterAccount = async (data: {
  to?: string;
  subject?: string;
  text?: string;
  html?: string;
}) => {
  try {
    const message = {
      from: TEST_EMAIL,
      to: data.to,
      subject: data.subject,
      text: data.text,
      html: data.html,
    };
    const info = await transporter.sendMail(message);
    return true;
  } catch (error: any) {
    return false;
  }
};