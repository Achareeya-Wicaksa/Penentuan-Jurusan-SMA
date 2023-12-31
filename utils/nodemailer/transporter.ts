import nodemailer from "nodemailer";

/**
 * Create a transporter to send email (server side only)
 * @see https://nodemailer.com/smtp/
 * @see https://nodemailer.com/usage/using-gmail/
 */
export const transporter = nodemailer.createTransport({
  service: process.env.NODEMAILER_SERVICE,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});
