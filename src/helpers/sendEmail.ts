// External Dependencies
import express, { Request, Response } from "express";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASSWORD,
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
      from: process.env.EMAIL_FROM,
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
