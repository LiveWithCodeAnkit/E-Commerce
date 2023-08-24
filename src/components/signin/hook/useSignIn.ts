import { signInSchema } from "../schema";

interface Props {
  email: string;
  password: string;
}

export const useSignIn = () => {
  const initialValues: Props = {
    email: "",
    password: "",
  };

  const handleSubmit = (values: Props, { resetForm }: any) => {
    console.log("I am login", values);

    resetForm();
  };

  return {
    initialValues,
    schema: signInSchema,
    submit: handleSubmit,
  };
};
