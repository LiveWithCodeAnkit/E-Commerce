import React, { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "../../../auth";

interface Props {
  children: ReactNode;
}

export default async function GuestLayout({ children }: Props) {
  const session = await auth();
  if (session) return redirect("/");
  return <div>{children}</div>;
}
