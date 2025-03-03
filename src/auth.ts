import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import { jwtVerify, SignJWT } from 'jose';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    GitHub,
    Credentials({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
        const res = await fetch(`${BASE_URL}/api/auth/token`, {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { 'Content-Type': 'application/json' },
        });

        const json = await res.json();
        const user = json.result;

        if (res.ok && user)
          return {
            id: user.id,
            email: user.email,
            accessToken: user.accessToken,
          };
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.provider = account?.provider || 'credentials'; // Lưu provider
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user.provider = token.provider;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    encode: async ({ secret, token }) => {
      return new SignJWT(token)
        .setProtectedHeader({ alg: 'HS512' })
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(new TextEncoder().encode(secret));
    },
    decode: async ({ secret, token }) => {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(secret), {
        algorithms: ['HS512'],
      });
      return payload;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 3600,
  },
});


