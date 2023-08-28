import * as Yup from "yup";
const emailRules = /^[a-zA-Z0-9._%+-]+@(gmail|yahoo)\.com$/;
const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid Email!")
    .matches(emailRules, { message: " Not valid :{" })
    .required("Email Required !"),
});

export default forgotPasswordSchema;
