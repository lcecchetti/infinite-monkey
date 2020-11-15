import { useContext } from 'react';
import IsOnContext from "lib/IsOnContext";
import { useMonkey } from "lib/monkey";
import styles from 'styles/components/MonkeyOutput.module.scss';

const MonkeyOutput = ({ quotes, literateRatio, maxEssayLength }) => {
  const isOn = useContext(IsOnContext);
  const { monkey, wakeUp, sleep } = useMonkey(quotes, literateRatio, maxEssayLength);

  /**
   * Toogle monkey isAwake
   */
  const toggleIsAwake = () => {
    if (!monkey.isAwake) {
      wakeUp();
    }
    else {
      sleep();
    }
  };

  /**
   * Restart the monkey
   */
  const restart = () => {
    sleep();
    wakeUp()
  }

  // stop the monkey
  if (!isOn && monkey.isAwake) {
    sleep();
  }

  return (
    <div className={styles.monkeyOutput}>

      <div className={styles.actions}>
        <button className={styles.awakeButton} onClick={toggleIsAwake}>{monkey.isAwake ? 'Stop The Monkey' : 'Execute Monkey Program'}</button>
      </div>

      {(monkey.isAwake || monkey.essay.length >= maxEssayLength) &&
        <div className={styles.monkeyEssay}>
          {monkey.essay.map((char, index) => (
            <span className={char.isQuote ? styles.highlight : ''} key={index}>{char.value}</span>
          ))}
        </div>
      }

      {monkey.essay.length >= maxEssayLength &&
        <div className={styles.actions}>
          <button className={styles.awakeButton} onClick={monkey.currentQuote.author ? sleep : restart}>{monkey.currentQuote.author ? 'Stop The Monkey' : 'Keep going'}</button>
        </div>
      }

      {!monkey.isAwake && monkey.currentQuote.author &&
        <div className={styles.moral}>
          <p>Congratulations, your MONKEY instance did quote {monkey.currentQuote.work} from {monkey.currentQuote.author}.</p>
          <p>
            But is that truly unexpected?<br/>
            What about this text? What about this program?<br/>
            And what about yourself?
          </p>
          <p>Isn't all of this just the latest character typed by this branch of the universe?</p>
          <p>ChAOS reading ChAOS' writings.</p>
        </div>
      }

    </div>
  );
};


export default MonkeyOutput;