import NextAuth, { AuthOptions, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "customer@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await fetch(
            `${process.env.INTERNAL_API_URL}/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            },
          );

          if (!res.ok) return null;

          const data = await res.json();

          if (data.token) {
            const payloadBase64 = data.token.split(".")[1];
            const decodedPayload = JSON.parse(
              Buffer.from(payloadBase64, "base64").toString("utf-8"),
            );
            return {
              id: credentials.email,
              email: credentials.email,
              name: decodedPayload.name,
              idToken: data.token,
              role: decodedPayload.role,
              phoneNumber: decodedPayload.phoneNumber,
            };
          }
          return null;
        } catch (error) {
          console.error("Failed to reach Spring Boot:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user, trigger, session }) {
      if (account?.provider === "google" && user) {
        try {
          const res = await fetch(
            `${process.env.INTERNAL_API_URL}/auth/google`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: user.email,
                name: user.name,
                googleIdToken: account.id_token,
              }),
            },
          );

          if (res.ok) {
            const data = await res.json();

            if (data.token) {
              const payloadBase64 = data.token.split(".")[1];
              const decodedPayload = JSON.parse(
                Buffer.from(payloadBase64, "base64").toString("utf-8"),
              );

              console.log("decoded payload: " + decodedPayload.role);

              token.idToken = data.token;
              token.role = decodedPayload.role;
              token.id = decodedPayload.id || user.id;
              token.phoneNumber = decodedPayload.phoneNumber;
            }
          } else {
            console.error("Failed to sync Google user with backend");
            token.error = "BackendSyncFailed";
          }
        } catch (error) {
          console.error("Error during Google backend sync:", error);
        }
      } else if (user) {
        token.id = user.id;
        token.idToken = user.idToken;
        token.role = user.role;
        token.phoneNumber = user.phoneNumber;
      }

      if (trigger === "update" && session) {
        if (session.fullName) {
          token.name = session.fullName;
        }
        if (session.phoneNumber) {
          token.phoneNumber = session.phoneNumber;
        }
      }

      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      session.idToken = token.idToken as string;
      session.role = token.role as string;
      session.phoneNumber = token.phoneNumber as string;
      session.error = token.error as string | undefined;

      if (session.user) {
        session.user.id = token.id as string;
        session.user.idToken = token.idToken as string;
        session.user.role = token.role as string;
        session.user.phoneNumber = token.phoneNumber as string;

        if (token.name) {
          session.user.name = token.name;
        }
      }

      if (token.idToken) {
        try {
          const res = await fetch(
            `${process.env.INTERNAL_API_URL}/users/sync`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token.idToken}`,
                "Content-Type": "application/json",
              },
            },
          );

          if (res.status === 401) {
            session.error = "RefreshAccessTokenError";
          }
        } catch (error) {
          console.error("Failed to sync user with backend:", error);
        }
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
