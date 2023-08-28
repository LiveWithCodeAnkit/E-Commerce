import * as Yup from "yup";

const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;
const resetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .matches(passwordRules, { message: "Please create a stronger password !" })
    .required("Password Required !"),
  passwordConfirmation: Yup.string()
    .oneOf([Yup.ref("password") || null], "Passwords must match")
    .required("Confirm-Password Required !"),
});

export default resetPasswordSchema;
