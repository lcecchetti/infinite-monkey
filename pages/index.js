import Head from 'next/head';
import styles from 'styles/Home.module.scss';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Infinite Monkey Theorem</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
          <h1>Infinite Monkey Theorem</h1>
      </main>
    </div>
  );
}
