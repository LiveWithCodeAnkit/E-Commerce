import { useSession } from "next-auth/react";
import React from "react";

interface Auth {
  loading: boolean;
  loggedIn: boolean;
  isAdmin: boolean;
}
const useAuth = (): Auth => {
  const session = useSession();
  return {
    loading: session.status === "loading",
    loggedIn: session.status === "authenticated",
    isAdmin: false,
  };
};

export default useAuth;
