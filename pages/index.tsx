import styles from 'styles/pages/Home.module.scss';
import MonkeyOutput from "components/MonkeyOutput";
import quotes from "data/quotes";
import Head from "next/head";

/**
 * @type {string}
 */
const THEOREM_DEFINITION = "The infinite monkey theorem states that a monkey hitting keys at random on a typewriter keyboard for an infinite amount of time will almost surely type any given text, such as the complete works of William Shakespeare";

const Home = () => {
  return (
    <>
      <Head>
        <title>Infinite Monkey Lab</title>
        <meta name="description" content={THEOREM_DEFINITION}/>
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
          content={THEOREM_DEFINITION}
        />
        <meta
          key="og:image"
          name="og:image"
          content="/favicon.ico"
        />

        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width"/>
      </Head>

      <div className={styles.home}>
        <div className={styles.header}>
          <h1 className={styles.logo}>Infinite Monkey LAB</h1>
        </div>
        <div className={styles.intro}>
          <p>"{THEOREM_DEFINITION}"</p>
          <p>By clicking execute, Infinite Monkey LAB will provide you a Digital MONKEY, a Virtual KEYBOARD and an infinite amount of TIME.</p>
        </div>
        <MonkeyOutput quotes={quotes} literateRatio={0.0005} maxEssayLength={1000}/>
      </div>
    </>
  );
}

export default Home;
