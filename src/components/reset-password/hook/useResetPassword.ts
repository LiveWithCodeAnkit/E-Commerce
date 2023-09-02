import { useRouter, useSearchParams } from "next/navigation";
import { useToastMessages } from "@/components/message/useToastMessages";
import { resetPasswordSchema } from "../schema";

interface Props {
  password: string;
  passwordConfirmation: string;
}
const useResetPassword = () => {
  const router = useRouter();
  const { Success, Warn } = useToastMessages();
  const searchParams = useSearchParams();
  const initialValues: Props = {
    password: "",
    passwordConfirmation: "",
  };
  const token = searchParams.get("token");
  const userId = searchParams.get("userId");

  const handleSubmit = async (values: Props, { resetForm }: any) => {
    const { password, passwordConfirmation } = values;

    const res = await fetch("/api/users/update-password", {
      method: "POST",
      body: JSON.stringify({ password, token, userId }),
    });

    const { message, error } = await res.json();
    if (res.ok) {
      Success(message);
      router.replace("/auth/signin");
    }
    if (!res.ok || error) {
      Warn(error);
    }
    resetForm();
  };

  return {
    initialValues,
    schema: resetPasswordSchema,
    submit: handleSubmit,
  };
};

export default useResetPassword;
