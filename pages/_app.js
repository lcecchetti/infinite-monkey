import 'styles/globals.scss';
import Head from 'next/head';

function InfiniteMonkeyApp({Component, pageProps}) {
  return (
    <>
      <Head>
        <title>Infinite Monkey Corp</title>
      </Head>

      <Component {...pageProps} />
    </>
  );
}

export default InfiniteMonkeyApp;
