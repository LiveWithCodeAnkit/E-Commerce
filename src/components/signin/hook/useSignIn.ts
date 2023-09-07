import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signInSchema } from "../schema";
import { useToastMessages } from "@/components/message/useToastMessages";

interface Props {
  email: string;
  password: string;
}

export const useSignIn = () => {
  const router = useRouter();
  const { Success, Warn } = useToastMessages();
  const initialValues: Props = {
    email: "",
    password: "",
  };

  const handleSubmit = async (values: Props, { resetForm }: any) => {
    const { email, password } = values;

    const signRes = await signIn("credentials", {
      ...values,
      redirect: false,
    });
   
    if (signRes?.error === "CredentialsSignin") {
  

      Warn("Something Wrong");
      router.refresh();
    }
    if (!signRes?.error) {
      Success("Welcome ");
      router.refresh();
    }

    resetForm();
  };

  return {
    initialValues,
    schema: signInSchema,
    submit: handleSubmit,
  };
};
