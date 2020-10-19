import 'styles/globals.scss';
import Head from 'next/head';
import Monitor from 'components/Monitor';

function InfiniteMonkeyApp({Component, pageProps}) {
  return (
    <>
      <Head>
        <title>Infinite Monkey Corp</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width"/>
      </Head>

      <Monitor>
        <Component {...pageProps} />
      </Monitor>
    </>
  );
}

export default InfiniteMonkeyApp;
