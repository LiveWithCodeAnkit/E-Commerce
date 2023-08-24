import React from "react";
import { signUpSchema } from "../schema";

interface Props {
  name: string;
  email: string;
  password: string;
}
const useSignUp = () => {
  const initialValues: Props = {
    name: "",
    email: "",
    password: "",
  };

  const handleSubmit = async (values: Props, { resetForm }: any) => {
    console.log("I am signUpSchema", values);

    await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify(values),
    }).then(async (res) => {
      if (res.ok) {
        const result = await res.json();
        console.log("I am data:=", result);
      }
    });

    resetForm();
  };

  return {
    initialValues,
    schema: signUpSchema,
    submit: handleSubmit,
  };
};

export default useSignUp;
