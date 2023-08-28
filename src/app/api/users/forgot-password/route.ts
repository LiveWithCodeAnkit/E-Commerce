import crypto from "crypto";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import UserModel from "@/app/model/userModel";
import PasswordResetTokenModel from "@/app/model/passwordResetTokenModel";
import { ForgetPasswordRequest } from "@/components/types";


import startDb from "@/app/lib/db";

export const POST = async (req: Request) => {
  try {
    const { email } = (await req.json()) as ForgetPasswordRequest;
    if (!email) {
      return NextResponse.json({ error: "Invalid Email " }, { status: 401 });
    }
    await startDb();
    const user = await UserModel.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User Not Found" }, { status: 404 });
    }

    await PasswordResetTokenModel.findOneAndDelete({ user: user._id });

    const token = crypto.randomBytes(36).toString("hex");

    await PasswordResetTokenModel.create({
      user: user.id,
      token,
    });

    const forgotUrl = `http://localhost:3000/auth/reset-password?token=${token}&userId=${user._id}`;

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "ef04625ff2cfdc",
        pass: "89fc0c22f3b13c",
      },
    });

    //   const verificationUrl = `http://localhost:3000/verify?token=${token}&userId=${newUser._id}`;

    await transport.sendMail({
      from: "ay@gmail.com",
      to: user.email,
      subject: "Forgot Your Password",
      html: `<h1> Forgot Password Link link <a href="${forgotUrl}">Click Me</a> </h1>`,
    });

    return NextResponse.json({ message: "Please Check Your Mail" });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong " },
      { status: 500 }
    );
  }
};
