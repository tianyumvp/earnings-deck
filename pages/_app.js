// pages/_app.js
import '../styles/globals.css';
import { Inter, IBM_Plex_Sans } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const plex = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-plex',
});

export default function MyApp({ Component, pageProps }) {
  return (
    <main className={`${inter.variable} ${plex.variable}`}>
      <Component {...pageProps} />
    </main>
  );
}