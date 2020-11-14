import 'styles/globals.scss';
import Head from 'next/head';
import Monitor from 'components/Monitor';
import CookieConsent from 'components/CookieConsent';


function InfiniteMonkeyApp({Component, pageProps}) {
  return (
    <>
      <Head>
        <title>Infinite Monkey Corp</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width"/>
      </Head>

      <Monitor>
        <Component {...pageProps} />
        <CookieConsent />
      </Monitor>
    </>
  );
}

export default InfiniteMonkeyApp;
