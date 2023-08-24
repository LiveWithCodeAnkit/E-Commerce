"use client";
import React, { useEffect } from "react";
import { redirect, notFound, useRouter } from "next/navigation";
import { useToastMessages } from "../message/useToastMessages";

interface Props {
  searchParams: {
    token: string;
    userId: string;
  };
}

const VerifyPage = ({ searchParams }: Props) => {
  const router = useRouter();

  const { Success, Warn, Info } = useToastMessages();

  const { token, userId } = searchParams;

  if (!token || !userId) {
    // redirect("/auth/signin");
    notFound();
  }

  useEffect(() => {
    fetch("/api/users/verify", {
      method: "POST",
      body: JSON.stringify({ token, userId }),
    }).then(async (res) => {
      const result = await res.json();
      const { error, message } = result as { message: string; error: string };
      if (res.ok) {
        Success(message);
        router.replace("/");
      } else {
        Warn(error);
      }
    });
  }, []);

  return (
    <>
      <div className="h-screen flex justify-center items-center flex-col">
        <div className="flex">
          <div className="flex flex-row space-x-4">
            <div
              className="w-12 h-12 rounded-full animate-spin
                    border border-dashed border-yellow-500 border-t-transparent"
            ></div>

            <div
              className="w-12 h-12 rounded-full animate-spin
                    border-2 border-dashed border-blue-500 border-t-transparent"
            ></div>

            <div
              className="w-12 h-12 rounded-full animate-spin
                    border-4 border-dashed border-green-500 border-t-transparent"
            ></div>

            <div
              className="w-12 h-12 rounded-full animate-spin
                    border-8 border-dashed border-purple-500 border-t-transparent"
            ></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyPage;
