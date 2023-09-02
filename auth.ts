import NextAuth, { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { SessionUserProfile } from "./src/components/types/index";
import { SignInCredentials } from "@/components/types";

declare module "next-auth" {
  interface Session {
    user: SessionUserProfile;
  }
}
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
        ).then(async (res) => await res.json());

        if (error) {
          return null;
        }
        return { id: user.id, ...user };
      },
    }),
  ],

  callbacks: {
    async jwt(params) {
      if (params.user) {
        // params.token.user = params.user;

        params.token = { ...params.token, ...params.user };
      }
      return params.token;
    },
    async session(params) {
      const user = params.token as typeof params.token & SessionUserProfile;

      if (user) {
        params.session.user = {
          ...params.session.user,
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          role: user.role,
          verified: user.verified,
        };
      }
      return params.session;
    },
  },
};

export const {
  auth,
  handlers: { GET, POST },
} = NextAuth(authConfig);
