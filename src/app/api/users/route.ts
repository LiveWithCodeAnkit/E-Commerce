import crypto from "crypto";
import { NextResponse } from "next/server";
import startDb from "@/app/lib/db";
import UserModel from "@/app/model/userModel";
import EmailVerificationToken from "@/app/model/emailVerificationToken";
import { NewUserRequest } from "@/components/types";
import { sendEmail } from "@/app/lib/email";

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

  const verificationUrl = `http://localhost:3000/verify?token=${token}&userId=${newUser._id}`;

  await sendEmail({
    profile: { name: newUser.name, email: newUser.email },
    subject: "verfication",
    linkUrl: verificationUrl,
  });

  return NextResponse.json({ message: "Please Check Your Mail" });
};
