/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth, { Session } from 'next-auth';
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
        console.log(user);
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
    async signIn({ user, account }): Promise<boolean> {
      if (account?.provider !== 'credentials') {
        try {
          const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
          const response = await fetch(`${BASE_URL}/api/auth/check-user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              image: user.image,
              provider: account?.provider,
            }),
          });

          const data = await response.json();
          if (data.code === 1000 && data.result) {
            user.id = data.result.id;
            user.accessToken = data.result.accessToken; 
          } else {
            const createResponse = await fetch(`${BASE_URL}/api/auth/check-user`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: user.email,
                name: user.name,
                image: user.image,
                provider: account?.provider,
              }),
            });
            const createData = await createResponse.json();

            console.log('createData:', createData);
            user.id = createData.result.id;
            user.accessToken = createData.result.accessToken;
          }
        } catch (error) {
          console.error('Lỗi khi kiểm tra/tạo người dùng:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.accessToken = user.accessToken;
      }

      return token;
    },
    async session({
      session,
      token,
    }: {
      session: Session & { accessToken?: string };
      token: any;
    }): Promise<Session> {
      session.user = {
        id: token.id,
        email: token.email,
        accessToken: token.accessToken,
      };
      session.accessToken = token.accessToken;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    encode: async ({ secret, token }) => {
      return new SignJWT(token as any)
        .setProtectedHeader({ alg: 'HS512' })
        .setIssuedAt()
        .setExpirationTime('1d')
        .sign(new TextEncoder().encode(Array.isArray(secret) ? secret[0] : secret));
    },
    decode: async ({ secret, token }) => {
      if (!token) {
        throw new Error('Token is required for decoding');
      }

      const secretKey = Array.isArray(secret) ? secret[0] : secret || '';
      const { payload } = await jwtVerify(token, new TextEncoder().encode(secretKey), {
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
