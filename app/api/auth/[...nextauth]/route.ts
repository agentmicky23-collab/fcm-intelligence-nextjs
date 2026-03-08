import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, accounts, sessions, verificationTokens } from "@/shared/schema";

export const authConfig: NextAuthConfig = {
  // @ts-ignore - Type mismatch between NextAuth beta and Drizzle adapter versions
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM || "noreply@fcm-intelligence.com",
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request",
    error: "/auth/error",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = (user as any).role || "insider";
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
        token.role = (user as any).role || "insider";
      }
      return token;
    },
  },
  events: {
    async createUser({ user }) {
      // Assign role based on email
      if (user.email === "mikeshparekh@gmail.com" && user.id) {
        await db
          .update(users)
          .set({ role: "admin" })
          .where(eq(users.id, user.id));
      }
    },
  },
  session: {
    strategy: "database",
  },
};

const { auth, handlers } = NextAuth(authConfig);

export const GET = handlers.GET;
export const POST = handlers.POST;
