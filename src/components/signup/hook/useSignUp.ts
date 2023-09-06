import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signUpSchema } from "../schema";
import { useToastMessages } from "@/components/message/useToastMessages";

interface Props {
  name: string;
  email: string;
  password: string;
}
const useSignUp = () => {
  const router = useRouter();
  const { Success, Warn } = useToastMessages();
  const initialValues: Props = {
    name: "",
    email: "",
    password: "",
  };

  const handleSubmit = async (values: Props, { resetForm }: any) => {
    const { name, email, password } = values;
    const res = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify(values),
    });
    const { message, error } = await res.json();
    if (res.ok) {
      Success(message);
      // router.replace("/auth/signin");
     await signIn("credentials", { email, password });
    }
    if (!res.ok || error) {

      console.log("i am error");
      
      Warn(error);
    }
    resetForm();
  };

  return {
    initialValues,
    schema: signUpSchema,
    submit: handleSubmit,
  };
};

export default useSignUp;
