import React, { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import EmailVerificationBanner from "@/components/profile/EmailVerificationBanner";
import Navbar from "@/components/navbar";

interface Props {
  children: ReactNode;
}

export default async function PerivateLayout({ children }: Props) {
  const session = await auth();
  if (!session) return redirect("/auth/signin");
  return (
    <div className="max-w-screen-xl mx-auto p-4 ">
      <Navbar />
      {/* <EmailVerificationBanner /> */}
      {children}
    </div>
  );
}
