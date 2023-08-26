import startDb from "@/app/lib/db";
import UserModel from "@/app/model/userModel";
import { SignInCredentials } from "@/components/types";
import { NextResponse } from "next/server";


export const POST = async (req: Request) => {
  const { email, password } = (await req.json()) as SignInCredentials;
  if (!email || !password) {
    return NextResponse.json({
      error: "Invalid Request email and Password Missing",
    });
  }
  await startDb();

  const user = await UserModel.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "Email/Password Mismatched!" });
  }
  const passwordMatched = await user.comparePassword(password);
  if (!passwordMatched) {
    return NextResponse.json({ error: "Email Password Mismatched !" });
  }

  return NextResponse.json({
    user: {
      id: user._id.toString(),
      name: user.name,
      avatar: user.avatar?.url,
      role: user.role,
    },
  });
};
