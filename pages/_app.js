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
        <meta name="description" content="The infinite monkey theorem states that a monkey hitting keys at random on a typewriter keyboard for an infinite amount of time will almost surely type any given text, such as the complete works of William Shakespeare"/>
        <meta
          key="og:type"
          name="og:type"
          content="website"
        />
        <meta
          key="og:title"
          name="og:title"
          content="Infinite Monkey Lab"
        />
        <meta
          key="og:description"
          name="og:description"
          content="The infinite monkey theorem states that a monkey hitting keys at random on a typewriter keyboard for an infinite amount of time will almost surely type any given text, such as the complete works of William Shakespeare"
        />

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
