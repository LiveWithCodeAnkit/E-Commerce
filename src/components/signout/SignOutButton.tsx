import React from "react";
import { signOut } from "next-auth/react";

interface Props {
  children: React.ReactNode;
}

const SignOutButton = ({ children }: Props) => {
  return (
    <>
      <div
        onClick={async () => {
          await signOut();
        }}
      >
        {children}
      </div>
    </>
  );
};
export default SignOutButton;
