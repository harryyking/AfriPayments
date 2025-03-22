import NextAuth from "next-auth/next";


declare module 'next-auth' {
    interface Session{
        user: {
            id: string;  // Add the id field
            email: string;
            name: string;
            image?: string;
          };
    }
}