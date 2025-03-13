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
    async signIn({ user, account }) {
      if (account?.provider === 'credentials') {
        return true;
      }

      try {
        const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

        const response = await fetch(
          `${BASE_URL}/api/auth/check-user`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              image: user.image,
              provider: account?.provider,
            }),
          },
        );
        const data = await response.json();
        const dbUser = data.result;
        if(dbUser){
          user.id = dbUser.id;
        }
        if (!response.ok) {
          throw new Error('Lỗi khi kiểm tra/tạo tài khoản');
        }

        return true; // Cho phép đăng nhập
      } catch (error) {
        console.error('Lỗi xác thực người dùng:', error);
        return false;
      }
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.provider = account?.provider || 'credentials';
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user.provider = token.provider;
      session.user.id = token.id;
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
