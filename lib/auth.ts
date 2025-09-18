import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "./prisma"

// Enterprise domain restriction (optional)
const ALLOWED_DOMAINS = process.env.ALLOWED_DOMAINS?.split(',') || []

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Enterprise domain restriction
      if (ALLOWED_DOMAINS.length > 0 && user.email) {
        const emailDomain = user.email.split('@')[1]
        if (!ALLOWED_DOMAINS.includes(emailDomain)) {
          return false // Block sign-in
        }
      }
      return true
    },
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        
        // Auto-create user preferences for enterprise users
        const existingPrefs = await prisma.userPreferences.findUnique({
          where: { userId: user.id }
        })
        
        if (!existingPrefs) {
          await prisma.userPreferences.create({
            data: {
              userId: user.id,
              mode: 'auto',
              // Enterprise users get server-side API keys automatically
            }
          })
        }
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
}
