import styles from 'styles/pages/Home.module.scss';
import MonkeyOutput from "components/MonkeyOutput";
import Monkey from 'lib/monkey';
import quotes from "lib/quotes";

export default function Home() {

  // a monkey
  var monkey = new Monkey(quotes, 1500, .005);

  return (
    <div className={styles.home}>
      <div className={styles.header}>
        <h1 className={styles.logo}>🐒 Infinite Monkey Corp ©</h1>
        <p></p>
      </div>
      <MonkeyOutput monkey={monkey}/>
    </div>
  );
}
