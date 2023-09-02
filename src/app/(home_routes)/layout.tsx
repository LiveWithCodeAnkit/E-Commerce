import React, { ReactNode } from "react";
import Navbar from "@/components/navbar";

interface Props {
  children: ReactNode;
}

export default async function HomeLayout({ children }: Props) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}
