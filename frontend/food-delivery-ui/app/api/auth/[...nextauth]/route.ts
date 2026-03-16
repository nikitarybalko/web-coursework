import NextAuth, { AuthOptions, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.idToken = account.id_token;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.idToken = token.idToken;

      if (token.idToken) {
        try {
          await fetch(`${process.env.BASE_URL}/api/users/sync`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token.idToken}`,
              "Content-Type": "application/json",
            },
          });
        } catch (error) {
          console.error("Failed to sync user with backend:", error);
        }
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
