import { SignInCredentials } from "@/components/types";
import NextAuth, { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials, request) {
        const { email, password } = credentials as SignInCredentials;

        const { user, error } = await fetch(
          "http://localhost:3000/api/users/signin",
          {
            method: "POST",
            body: JSON.stringify({ email, password }),
          }
        ).then(async (res) => {
          return await res.json(); // Assign the parsed JSON data to 'user'
        });

        if (error) {
          throw new Error(error);
        }
        return { id: user.id };
      },
    }),
  ],
};

// const authConfig: NextAuthConfig = {
//   providers: [
//     CredentialsProvider({
//       name: "credentials", 
//       credentials: {}, 
//       async authorize(credentials, request) {
//         const { email, password } = credentials as SignInCredentials;
//         const response = await fetch("http://localhost:3000/api/users/signin", {
//           method: "POST",
//           body: JSON.stringify({ email, password }),
//         });
//         const data = await response.json(); 
//         if (!response.ok) {
//           // throw new Error(data.error || "Authentication failed");
//           return null;
//         }
//         return { id: data.user.id };
//       },
//     }),
//   ],
// };
export const {
  auth,
  handlers: { GET, POST },
} = NextAuth(authConfig);
