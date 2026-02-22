// pages/api/auth/[...nextauth].js
// Google 登录配置 + Neon Postgres 数据库

import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { Pool } from '@neondatabase/serverless';
import PostgresAdapter from '@auth/pg-adapter';

// 创建 Postgres 连接池
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

export const authOptions = {
  adapter: PostgresAdapter(pool),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('✅ SignIn callback:', { user: user?.email, provider: account?.provider });
      return true;
    },
    async session({ session, user }) {
      console.log('✅ Session callback:', { sessionUser: session?.user?.email, dbUserId: user?.id });
      if (user) {
        session.user.id = user.id;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      console.log('🔄 Redirect callback:', { url, baseUrl });
      // 允许返回到首页
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  trustHost: true, // 信任本地主机
};

export default NextAuth(authOptions);
