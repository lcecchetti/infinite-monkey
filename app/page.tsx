import type { Metadata } from 'next';
import styles from 'styles/app/Home.module.scss';
import MonkeyOutput from 'components/MonkeyOutput';
import quotes from 'data/quotes';

const THEOREM_DEFINITION = "The infinite monkey theorem states that a monkey hitting keys at random on a typewriter keyboard for an infinite amount of time will almost surely type any given text, such as the complete works of William Shakespeare.";

export const metadata: Metadata = {
  title: 'Infinite Monkey Lab',
  description: THEOREM_DEFINITION,
  openGraph: {
    type: 'website',
    title: 'Infinite Monkey Lab',
    description: THEOREM_DEFINITION,
    images: ['/favicon.ico'],
  },
};

const Home = () => {
  return (
    <div className={styles.home}>
      <div className={styles.header}>
        <h1 className={styles.logo}>Infinite Monkey LAB</h1>
      </div>
      <div className={styles.intro}>
        <p>&quot;{THEOREM_DEFINITION}&quot;</p>
        <p>By clicking execute, Infinite Monkey LAB will provide you with a Digital MONKEY, a Virtual KEYBOARD, and an infinite amount of TIME.</p>
      </div>
      <MonkeyOutput quotes={quotes} literateRatio={0.0005} maxEssayLength={600}/>
    </div>
  );
};

export default Home;
