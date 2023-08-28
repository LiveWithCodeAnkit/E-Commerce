import React from "react";
import forgotPasswordSchema from "../schema/forgotPasswordSchema";
import { useToastMessages } from "@/components/message/useToastMessages";


interface Props {
  email: string;
}
export const useForgotPassword = () => {
  const { Success, Warn } = useToastMessages();
  const initialValues: Props = {
    email: "",
  };

  const handleSubmit = async (values: Props, { resetForm }: any) => {
    const res = await fetch("/api/users/forgot-password", {
      method: "POST",
      body: JSON.stringify(values),
    });

    const { message, error } = await res.json();
    if (res.ok) {
      Success(message);
    }
    if (!res.ok || error) {
      Warn(error);
    }
    resetForm();
  };
  return {
    initialValues,
    schema: forgotPasswordSchema,
    submit: handleSubmit,
  };
};
