import { SessionProvider } from "next-auth/react";
import React from "react";

interface Props {
  children: React.ReactNode;
}

const AuthSession = ({ children }: Props) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default AuthSession;
