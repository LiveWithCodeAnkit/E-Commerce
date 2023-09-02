import nodemailer from "nodemailer";
type profile = { name: string; email: string };

interface EmailOptions {
  profile: profile;
  subject: "verfication" | "forgot-password" | "password-changed";
  linkUrl: string;
}

const generateMailTransport = () => {
  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "ef04625ff2cfdc",
      pass: "89fc0c22f3b13c",
    },
  });

  return transport;
};
const sendEmailVerificationLink = async (profile: profile, linkUrl: string) => {
  const transport = generateMailTransport();
  //   const verificationUrl = `http://localhost:3000/verify?token=${token}&userId=${newUser._id}`;

  await transport.sendMail({
    from: "ay@gmail.com",
    to: profile.email,
    subject: "Invitation Of Hell",
    html: `<h1> click on this link <a href="${linkUrl}">Click Me</a> </h1>`,
  });
};

const sendForgotPasswordLink = async (profile: profile, linkUrl: string) => {
  const transport = generateMailTransport();

  await transport.sendMail({
    from: "ay@gmail.com",
    to: profile.email,
    subject: "Forgot Your Password",
    html: `<h1> Forgot Password Link link <a href="${linkUrl}">Click Me</a> </h1>`,
  });
};

const sendUpdatePasswordConfirmation = async (profile: profile) => {
  const transport = generateMailTransport();

  await transport.sendMail({
    from: "ay@gmail.com",
    to: profile.email,
    subject: "Password Changed",
    html: `<h1>Your Password Successfully Changed</h1>`,
  });
};

export const sendEmail = (options: EmailOptions) => {
  const { profile, subject, linkUrl } = options;

  switch (subject) {
    case "verfication":
      return sendEmailVerificationLink(profile, linkUrl);
    case "forgot-password":
      return sendForgotPasswordLink(profile, linkUrl);
    case "password-changed":
      return sendUpdatePasswordConfirmation(profile);
  }
};
