import 'styles/globals.scss';
import Head from 'next/head';
import Monitor from 'components/Monitor';
import CookieConsent from 'components/CookieConsent';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import * as gtag from 'lib/gtag';

function InfiniteMonkeyApp({Component, pageProps}) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events]);

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

export default InfiniteMonkeyApp;
