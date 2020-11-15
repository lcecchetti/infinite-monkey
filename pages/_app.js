import 'styles/globals.scss';
import Head from 'next/head';
import Monitor from 'components/Monitor';
import CookieConsent from 'components/CookieConsent';
import Router from "next/router";
import withGA from "next-ga";


function InfiniteMonkeyApp({Component, pageProps}) {
  return (
    <>
      <Head>
        <title>Infinite Monkey Lab</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width"/>
      </Head>

      <Monitor>
        <Component {...pageProps} />
        <CookieConsent />
      </Monitor>
    </>
  );
}

export default withGA("G-JG1MNXXKL2", Router)(InfiniteMonkeyApp);
