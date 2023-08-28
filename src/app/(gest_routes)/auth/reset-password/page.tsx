import startDb from "@/app/lib/db";
import PasswordResetTokenModel from "@/app/model/passwordResetTokenModel";
import ResetPassword from "@/components/reset-password/ResetPassword";
import { notFound } from "next/navigation";

import React from "react";
interface Props {
  searchParams: {
    token: string;
    userId: string;
  };
}


// const fetchTokenValidation = async (token: string, userId: string) => {
//   await startDb();
//   const resetToken = PasswordResetTokenModel.findOne({ user: userId });

//   if (!resetToken) {
//     return null;
//   }
//   const matched = await resetToken.compareToken(token);
//   if (!matched) {
//     return null;
//   }
//   return true;
// };


const fetchTokenValidation = async (token: string, userId: string) => {
  await startDb();
  const resetToken = await PasswordResetTokenModel.findOne({ user: userId });

  if (!resetToken) {
    return null;
  }
  const matched = await resetToken.compareToken(token);
  if (!matched) {
    return null;
  }
  return true;
};

const page = async ({ searchParams }: Props) => {
  const { token, userId } = searchParams;

  if (!token || !userId) {
    return notFound();
  }

  const isValid = await fetchTokenValidation(token, userId);

  if (!isValid) {
    return notFound();
  }
  return (
    <>
      <ResetPassword token={token} userId={userId}/>
    </>
  );
};

export default page;
