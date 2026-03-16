import "next-auth";
import "next-auth/jwt";

// 1. Extend the built-in Session type
declare module "next-auth" {
  interface Session {
    idToken?: string; // Add your custom property
  }
}

// 2. Extend the built-in JWT type
declare module "next-auth/jwt" {
  interface JWT {
    idToken?: string; // Add your custom property
  }
}
