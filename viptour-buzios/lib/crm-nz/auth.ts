import "server-only";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import domain from "./domain";
import { configured, resolveMember, CRM_PATH } from "./access";

export const { handlers, auth, signIn, signOut } = NextAuth({
  basePath: "/api/crm-nz/auth",
  secret: process.env.CRM_NZ_AUTH_SECRET,
  trustHost: true,
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
  providers: [
    Google({
      clientId: process.env.CRM_NZ_GOOGLE_CLIENT_ID || "unconfigured",
      clientSecret: process.env.CRM_NZ_GOOGLE_CLIENT_SECRET || "unconfigured",
      checks: ["pkce", "state", "nonce"],
      authorization: {
        params: { scope: "openid email profile", prompt: "select_account" },
      },
    }),
  ],
  pages: { signIn: CRM_PATH, error: CRM_PATH },
  cookies: {
    sessionToken: {
      name: "crm-nz.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  callbacks: {
    signIn({ account, profile }) {
      return (
        configured() &&
        account?.provider === "google" &&
        domain.googleAllowed(process.env.CRM_NZ_USERS_JSON, profile)
      );
    },
    jwt({ token, account, profile }) {
      if (account && profile) {
        token.sub = account.providerAccountId;
        token.email = profile.email;
      }
      // Never accept roles or identity from a client session update.
      return token;
    },
    session({ session, token }) {
      if (session.user) session.user.id = token.sub || "";
      return session;
    },
    redirect({ url }) {
      const origin = process.env.CRM_NZ_ORIGIN;
      if (!origin) return "http://localhost:3000" + CRM_PATH;
      return url === origin + CRM_PATH ? url : origin + CRM_PATH;
    },
  },
  logger: {
    error(error) {
      console.error("CRM_NZ_AUTH_ERROR", error.name);
    },
  },
});
export async function requireMember() {
  if (!configured()) return resolveMember();
  const session = await auth();
  return resolveMember(session?.user?.email, session?.user?.id);
}
