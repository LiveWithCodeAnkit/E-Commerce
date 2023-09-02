import crypto from "crypto";
import { isValidObjectId } from "mongoose";
import UserModel from "@/app/model/userModel";
import startDb from "@/app/lib/db";
import EmailVerificationToken from "@/app/model/emailVerificationToken";
import { NextResponse } from "next/server";
import { EmailVerifyRequest } from "@/components/types";
import { sendEmail } from "@/app/lib/email";

export const POST = async (req: Request) => {
  try {
    const { token, userId } = (await req.json()) as EmailVerifyRequest;
    await startDb();
    if (!isValidObjectId(userId) || !token) {
      return NextResponse.json(
        { error: "Invalid Request Token and UserId required !" },
        { status: 401 }
      );
    }
    const verifyToken = await EmailVerificationToken.findOne({ user: userId });
    if (!verifyToken) {
      return NextResponse.json({ error: "Invalid Token" }, { status: 400 });
    }

    const isMatched = await verifyToken.compareToken(token);
    if (!isMatched) {
      return NextResponse.json({ error: "Invalid Token" }, { status: 400 });
    }

    await UserModel.findByIdAndUpdate(userId, { verified: true });
    await EmailVerificationToken.findByIdAndDelete(verifyToken._id);

    return NextResponse.json({ message: "Your Email Verified" });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went Wrong" },
      { status: 500 }
    );
  }
};

export const GET = async (req: Request) => {
  try {
    const userId = req.url.split("userId=")[1];
    await startDb();
    if (!isValidObjectId(userId)) {
      return NextResponse.json(
        { error: "Invalid Request Token and UserId Missing !" },
        { status: 401 }
      );
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid Request Usernot Found !" },
        { status: 401 }
      );
    }

    if (user.verified) {
      return NextResponse.json(
        { error: "Invalid Request User Already verified !" },
        { status: 401 }
      );
    }

    const token = crypto.randomBytes(36).toString("hex");

    await EmailVerificationToken.findOneAndDelete({ user: userId });
    await EmailVerificationToken.create({
      user: userId,
      token,
    });
    const verificationUrl = `http://localhost:3000/verify?token=${token}&userId=${userId}`;

    await sendEmail({
      profile: { name: user.name, email: user.email },
      subject: "verfication",
      linkUrl: verificationUrl,
    });
    return NextResponse.json({ message: "Please Check Your Mail" });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went Wrong" },
      { status: 500 }
    );
  }
};
