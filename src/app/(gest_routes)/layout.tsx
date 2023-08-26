import React, { ReactNode } from "react";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";
// import { auth } from "../../../auth";

interface Props {
  children: ReactNode;
}
// const GuestLayout = async ({ children }: Props) => {
//   const session = auth();
//   console.log("i am sss",session);

//   return <div>{children}</div>;
// };

// export default GuestLayout;

export default async function GuestLayout({ children }: Props) {
  const session = await auth();
  if (session) return redirect("/");
  return <div>{children}</div>;
}
