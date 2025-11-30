// pages/_app.js
import '../styles/globals.css';
import Head from 'next/head';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta
          name="google-site-verification"
          content="R6UhVa46Ph2zXbuw6FYpSAeaFWjulAvFBiNdK5S50dM"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
