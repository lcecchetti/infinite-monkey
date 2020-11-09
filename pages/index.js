import styles from 'styles/pages/Home.module.scss';
import MonkeyOutput from "components/MonkeyOutput";
import quotes from "lib/quotes";

export default function Home() {
  return (
    <div className={styles.home}>
      <div className={styles.header}>
        <h1 className={styles.logo}>Infinite Monkey LAB</h1>
      </div>
      <div className={styles.intro}>
        <p>"The infinite monkey theorem states that a monkey hitting keys at random on a typewriter keyboard for an infinite amount of time will almost surely type any given text, such as the complete works of William Shakespeare"</p>
        <p>By executing the Program, Infinite Monkey LAB provides your own Digital MONKEY instance, which will be fed with Digital BANANAS each time it'll match a quote from the HAMLET.</p>
      </div>
      <MonkeyOutput quotes={quotes} maxEssayLength={2000} literateRatio={0.001} />
    </div>
  );
}
