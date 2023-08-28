import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";
import EmailVerificationToken from "@/app/model/emailVerificationToken";
import { NewUserRequest } from "@/components/types";
import startDb from "@/app/lib/db";
import UserModel from "@/app/model/userModel";

export const POST = async (req: Request) => {
  const body = (await req.json()) as NewUserRequest;
  await startDb();
  const newUser = await UserModel.create({
    ...body,
  });

  const token = crypto.randomBytes(36).toString("hex");

  await EmailVerificationToken.create({
    user: newUser._id,
    token,
  });


  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "ef04625ff2cfdc",
      pass: "89fc0c22f3b13c",
    },
  });

  const verificationUrl = `http://localhost:3000/verify?token=${token}&userId=${newUser._id}`;

  await transport.sendMail({
    from: "ay@gmail.com",
    to: newUser.email,
    subject: "Invitation Of Hell",
    html: `<h1> click on this link <a href="${verificationUrl}">Click Me</a> </h1>`,
  });

  return NextResponse.json({ message: "Please Check Your Mail" });
};
