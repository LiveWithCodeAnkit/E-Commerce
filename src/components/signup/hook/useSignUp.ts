import { signUpSchema } from "../schema";
import { useToastMessages } from "@/components/message/useToastMessages";

interface Props {
  name: string;
  email: string;
  password: string;
}
const useSignUp = () => {
  const { Success, Warn } = useToastMessages();
  const initialValues: Props = {
    name: "",
    email: "",
    password: "",
  };

  const handleSubmit = async (values: Props, { resetForm }: any) => {
    await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify(values),
    }).then(async (res) => {
      if (res.ok) {
        const result = await res.json();
        const { error, message } = result as { message: string; error: string };
        Success(message);
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
