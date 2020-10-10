import 'styles/globals.scss';
import Head from 'next/head';

function InfiniteMonkeyApp({Component, pageProps}) {
  return (
    <>
      <Head>
        <title>Infinite Monkey Theorem</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width"/>
      </Head>

      <Component {...pageProps} />
    </>
  );
}

export default InfiniteMonkeyApp;
