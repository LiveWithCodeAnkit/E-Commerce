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
          console.log(" i am call Logout");

          await signOut();
        }}
      >
        {children}
      </div>
    </>
  );
};

export default SignOutButton;
