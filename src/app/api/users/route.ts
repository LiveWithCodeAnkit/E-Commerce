import { NewUserRequest } from "./../../../components/types/index";
import startDb from "@/app/lib/db";
import UserModel from "@/app/model/userModel";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const body = (await req.json()) as NewUserRequest;
  await startDb();
  const newUser = await UserModel.create({
    ...body,
  });

  return NextResponse.json(newUser);
};
