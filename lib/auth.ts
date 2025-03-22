import {NextAuthOptions} from 'next-auth'
import GoogleProvider from "next-auth/providers/google"
import prisma from './db'
import {PrismaAdapter} from '@auth/prisma-adapter'
import Email from 'next-auth/providers/email'

const RATE_LIMIT_REQUESTS = 5; // Max 5 sign-in attempts
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();


export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
       GoogleProvider({
        clientId: process.env.AUTH_GOOGLE_ID!,
        clientSecret: process.env.AUTH_GOOGLE_SECRET!,
        authorization: {
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code",
          },
        },
       }),
       
    ],
    secret: process.env.NEXTAUTH_SECRET,

    callbacks: {
        async signIn({user}) {
          const userId = user.id;
          const now = Date.now();
          const rateLimitData = rateLimitMap.get(userId) || { count: 0, timestamp: now };
    
          // Reset count if the window has expired
          if (now - rateLimitData.timestamp > RATE_LIMIT_WINDOW) {
            rateLimitMap.set(userId, { count: 0, timestamp: now });
          }
    
          // Check rate limit
          if (rateLimitData.count >= RATE_LIMIT_REQUESTS) {
            throw new Error("Too many sign-in attempts. Please try again later.");
          }
    
          // Increment the counter
          rateLimitMap.set(userId, { count: rateLimitData.count + 1, timestamp: rateLimitData.timestamp });
        
          return true;
          },
          


        },
        pages: {
          signIn: '/auth/signin',
          verifyRequest: '/auth/verify'
        }
    
}


