import styles from 'styles/pages/Home.module.scss';
import MonkeyOutput from "components/MonkeyOutput";
import quotes from "data/quotes";

const Home = () => {
  return (
    <div className={styles.home}>
      <div className={styles.header}>
        <h1 className={styles.logo}>Infinite Monkey LAB</h1>
      </div>
      <div className={styles.intro}>
        <p>"The infinite monkey theorem states that a monkey hitting keys at random on a typewriter keyboard for an infinite amount of time will almost surely type any given text, such as the complete works of William Shakespeare"</p>
        <p>By clicking execute, Infinite Monkey LAB will provide you a Digital MONKEY, a Virtual KEYBOARD and an infinite amount of TIME.</p>
      </div>
      <MonkeyOutput quotes={quotes} literateRatio={0.0005} maxEssayLength={1000}/>
    </div>
  );
}

export default Home;
