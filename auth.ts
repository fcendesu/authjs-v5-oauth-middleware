import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { MongoDBAdapter } from "@auth/mongodb-adapter";

import client from "@/lib/db";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: MongoDBAdapter(client),
  session: { strategy: "jwt" },
  providers: [GitHub, Google],
});
