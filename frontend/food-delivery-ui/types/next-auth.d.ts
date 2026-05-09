import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    idToken?: string;
    role?: string;
    phoneNumber?: string;
    error?: string;
    user: {
      idToken?: string;
      role?: string;
      phoneNumber?: string;
    } & DefaultSession["user"];
  }
  interface User {
    idToken?: string;
    role?: string;
    phoneNumber?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    idToken?: string;
    role?: string;
    phoneNumber?: string;
  }
}
