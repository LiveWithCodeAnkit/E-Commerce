import { isValidObjectId } from "mongoose";
import { EmailVerifyRequest } from "@/components/types";
import { NextResponse } from "next/server";
import EmailVerificationToken from "@/app/model/emailVerificationToken";
import UserModel from "@/app/model/userModel";

export const POST = async (req: Request) => {
  try {
    const { token, userId } = (await req.json()) as EmailVerifyRequest;
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
