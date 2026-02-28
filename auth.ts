import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { turso } from "@/lib/turso";
import { hash, compare } from "bcrypt-ts";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      authorization: { params: { scope: "identify email guilds.join" } },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email as string;
        const password = credentials.password as string;
        const name = credentials.name as string | undefined;

        // 1. Search for user in the database
        const res = await turso.execute({
          sql: "SELECT id, email, password, name FROM users WHERE email = ? LIMIT 1",
          args: [email],
        });

        const user = res.rows[0];

        // 2. Registration Logic (if user doesn't exist and name is provided)
        if (!user && name) {
          const hashedPassword = await hash(password, 10);
          const userId = crypto.randomUUID();

          await turso.execute({
            sql: "INSERT INTO users (id, email, password, name) VALUES (?, ?, ?, ?)",
            args: [userId, email, hashedPassword, name],
          });

          return { id: userId, email: email, name: name };
        }

        // 3. Login Logic
        if (user && user.password) {
          const isPasswordValid = await compare(
            password,
            user.password as string
          );

          if (isPasswordValid) {
            return {
              id: String(user.id),
              email: String(user.email),
              name: String(user.name),
            };
          }
        }

        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user, account }: any) {
      // ID PERSISTENCE:
      // Map the internal database ID or Provider ID to the token
      if (user) {
        token.id = user.id;
        token.sub = user.id; 
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }: any) {
      // Pass the persistent ID from the token to the session object
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.accessToken = token.accessToken;
      }
      return session;
    },
    async signIn({ user, account }: any) {
      // Sync social providers (Discord/Google) with the 'users' table
      if (account?.provider === "discord" || account?.provider === "google") {
        try {
          await turso.execute({
            sql: "INSERT OR IGNORE INTO users (id, email, name) VALUES (?, ?, ?)",
            args: [user.id, user.email || "", user.name || ""],
          });

          // Auto-join Discord Server logic
          if (account.provider === "discord" && account.access_token) {
            const guildId = "1457507130968903845";
            const botToken = process.env.DISCORD_BOT_TOKEN;

            fetch(`https://discord.com/api/guilds/${guildId}/members/${user.id}`, {
              method: "PUT",
              headers: {
                Authorization: `Bot ${botToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ access_token: account.access_token }),
            }).catch(e => console.error("Discord Auto-Join Failed:", e));
          }
        } catch (error) {
          console.error("Auth Sync Error:", error);
        }
      }
      return true;
    },
  },
});