// pages/_app.js
import '../styles/globals.css';
import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';

export default function MyApp({ 
  Component, 
  pageProps: { session, ...pageProps }
}) {
  return (
    <SessionProvider 
      session={session}
      refetchInterval={5 * 60} // 每5分钟刷新一次session
      refetchOnWindowFocus={true} // 窗口聚焦时刷新
    >
      <Head>
        <meta
          name="google-site-verification"
          content="R6UhVa46Ph2zXbuw6FYpSAeaFWjulAvFBiNdK5S50dM"
        />
      </Head>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
