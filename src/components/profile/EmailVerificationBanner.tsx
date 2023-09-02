"use client";
import React, { useState } from "react";
import { useAuth } from "../navbar/hook";
import { useToastMessages } from "../message/useToastMessages";

const EmailVerificationBanner = () => {
  const { profile } = useAuth();

  const [submitting, setSubmitting] = useState(false);
  const { Success, Warn } = useToastMessages();
  const applyForReverification = async () => {
    if (!profile) return;
    setSubmitting(true);
    const res = await fetch("/api/users/verify?userId=" + profile?.id, {
      method: "GET",
    });
    const { message, error } = await res.json();

    if (res.ok) {
      Success(message);
      setSubmitting(false);
    }
    if (!res.ok || error) {
      Warn(error);
    }
  };

  if (profile?.verified) {
    return null;
  }
  return (
    <>
      <div className="alert alert-info">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <span>It look like you have not verified your email</span>
        <div>
          <button
            onClick={applyForReverification}
            disabled={submitting}
            className="btn btn-primary"
          >
            {submitting ? "Genrating link..." : "  Get verification link"}
          </button>
        </div>
      </div>
    </>
  );
};

export default EmailVerificationBanner;
