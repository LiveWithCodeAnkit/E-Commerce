import crypto from "crypto";
import UserModel from "@/app/model/userModel";
import PasswordResetTokenModel from "@/app/model/passwordResetTokenModel";
import { NextResponse } from "next/server";
import { ForgetPasswordRequest } from "@/components/types";

import startDb from "@/app/lib/db";
import { sendEmail } from "@/app/lib/email";

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

    await sendEmail({
      profile: { name: user.name, email: user.email },
      subject: "forgot-password",
      linkUrl: forgotUrl,
    });

    return NextResponse.json({ message: "Please Check Your Mail" });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong " },
      { status: 500 }
    );
  }
};
