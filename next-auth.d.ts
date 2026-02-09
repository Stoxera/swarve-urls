import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    provider?: string; // Añadimos el provider a la sesión
    user: {
      id?: string;
    } & DefaultSession["user"]
  }

  interface Account {
    provider?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    provider?: string;
  }
}