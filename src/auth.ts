import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';

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
        const res = await fetch('http://localhost:8080/api/auth/token', {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { 'Content-Type': 'application/json' },
        });

        const json = await res.json();
        const user = json.result;
        console.log(user)

        if (res.ok && user) return {
           id: user.id, 
           email: user.email, 
           accessToken: user.accessToken, 
        }
        console.log(user)
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Lưu JWT vào token
      if (user) {
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      // Lưu JWT vào session
      session.accessToken = token.accessToken;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Khóa bí mật để mã hóa session
  session: {
    strategy: 'jwt', // Sử dụng JWT thay vì session database
  },
});
