import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import { turso } from "@/lib/turso";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      // Requesting identify, email, and guilds.join scopes
      authorization: "https://discord.com/api/oauth2/authorize?scope=identify+email+guilds.join",
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account, profile }) {
      // Use Discord's permanent ID as the primary key
      if (profile) {
        token.id = profile.id;
      }
      // Persist the OAuth access token for the guild join logic
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },

    async session({ session, token }: any) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.accessToken = token.accessToken;
      }
      return session;
    },

    async signIn({ user, account }: any) {
      if (account?.provider === "discord") {
        try {
          // 1. Sync User with Turso Database (Handle link limits)
          // We use INSERT OR IGNORE so we don't overwrite existing limits
          await turso.execute({
            sql: "INSERT OR IGNORE INTO users (id, email, linksMax) VALUES (?, ?, ?)",
            args: [user.id, user.email || "", 30],
          });

          // 2. Auto-join Discord Server logic
          if (account.access_token) {
            const guildId = "TU_GUILD_ID_AQUI"; // Replace with your Server ID
            const botToken = process.env.DISCORD_BOT_TOKEN;

            await fetch(
              `https://discord.com/api/guilds/${guildId}/members/${user.id}`,
              {
                method: "PUT",
                headers: {
                  Authorization: `Bot ${botToken}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ access_token: account.access_token }),
              }
            );
          }
        } catch (error) {
          // We log the error but allow the user to sign in anyway
          console.error("Auth Sync Error:", error);
        }
      }
      return true;
    },
  },
});