import { isValidObjectId } from "mongoose";
import UserModel from "@/app/model/userModel";
import startDb from "@/app/lib/db";
import PasswordResetTokenModel from "@/app/model/passwordResetTokenModel";
import { UpdatePasswordRequest } from "@/components/types";
import { NextResponse } from "next/server";
import { sendEmail } from "@/app/lib/email";

export const POST = async (req: Request) => {
  try {
    const { token, userId, password } =
      (await req.json()) as UpdatePasswordRequest;

    if (!token || !password || !isValidObjectId(userId)) {
      return NextResponse.json({ error: "Invalid Request" }, { status: 401 });
    }

    await startDb();
    const resetToken = await PasswordResetTokenModel.findOne({ user: userId });

    if (!resetToken) {
      return NextResponse.json(
        { error: "Unauthorized Error" },
        { status: 401 }
      );
    }

    const matched = await resetToken.compareToken(token);

    if (!matched) {
      return NextResponse.json(
        { error: "Unauthorized Error" },
        { status: 401 }
      );
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not Found" }, { status: 404 });
    }

    const isMatched = await user.comparePassword(password);
    if (isMatched) {
      return NextResponse.json(
        { error: "New Password Must Be Different" },
        { status: 401 }
      );
    }

    user.password = password;
    await user.save();

    await PasswordResetTokenModel.findByIdAndDelete(resetToken._id);

    await sendEmail({
      profile: { name: user.name, email: user.email },
      subject: "password-changed",
      linkUrl: "",
    });

    return NextResponse.json({ message: "Please Check Your Mail" });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went Wrong" },
      { status: 500 }
    );
  }
};
