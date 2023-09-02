import React, { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import AdminSidebar from "@/components/admin/sidebar/AdminSidebar";

interface Props {
  children: ReactNode;
}

export default async function AdminLayout({ children }: Props) {
  const session = await auth();
  const user = session?.user;
  const isAdmin = user?.role === "admin";
  if (!isAdmin) return redirect("/auth/signin");

  return <AdminSidebar>{children}</AdminSidebar>;
}
