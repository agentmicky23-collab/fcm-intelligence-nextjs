import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { users, accounts, sessions, verificationTokens } from "@/shared/schema";

// Create auth config lazily - only when environment variables are available
function createAuthConfig(): NextAuthConfig {
  const providers = [];
  
  // Only add EmailProvider if EMAIL_SERVER is configured
  if (process.env.EMAIL_SERVER) {
    providers.push(
      EmailProvider({
        server: process.env.EMAIL_SERVER,
        from: process.env.EMAIL_FROM || "noreply@fcm-intelligence.com",
      })
    );
  }

  const config: NextAuthConfig = {
    providers,
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
    session: {
      strategy: "jwt", // Use JWT if no database
    },
  };

  // Add adapter only if DATABASE_URL is available
  if (process.env.DATABASE_URL) {
    // @ts-ignore - Type mismatch between NextAuth beta and Drizzle adapter versions
    config.adapter = DrizzleAdapter(getDb(), {
      usersTable: users,
      accountsTable: accounts,
      sessionsTable: sessions,
      verificationTokensTable: verificationTokens,
    });
    config.session = { strategy: "database" };
    config.events = {
      async createUser({ user }) {
        // Assign role based on email
        if (user.email === "mikeshparekh@gmail.com" && user.id) {
          await getDb()
            .update(users)
            .set({ role: "admin" })
            .where(eq(users.id, user.id));
        }
      },
    };
  }

  return config;
}

export const { handlers, auth, signIn, signOut } = NextAuth(createAuthConfig());
