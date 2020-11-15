import { useContext } from 'react';
import IsMonitorOnContext from "lib/IsMonitorOnContext";
import useMonkey from "lib/useMonkey";
import styles from 'styles/components/MonkeyOutput.module.scss';

const MonkeyOutput = ({ quotes, literateRatio, maxEssayLength }) => {
  const isMonitorOn = useContext(IsMonitorOnContext);
  const { monkey, wakeUp, sleep } = useMonkey(quotes, literateRatio, maxEssayLength);

  // stop the monkey
  if (!isMonitorOn && monkey.isAwake) {
    sleep();
  }

  return (
    <div className={styles.monkeyOutput}>

      <div className={styles.actions}>
        <button className={styles.awakeButton} onClick={monkey.isAwake ? sleep : wakeUp}>{monkey.isAwake ? 'Stop The Monkey' : 'Execute Monkey Program'}</button>
      </div>

      {!!monkey.essay.length &&
        <div className={styles.monkeyEssay}>
          {monkey.essay.map((char, index) => (
            <span className={char.isQuote ? styles.highlight : ''} key={index}>{char.value}</span>
          ))}
        </div>
      }

      {(monkey.essay.length >= maxEssayLength && !monkey.currentQuote) &&
        <div className={styles.actions}>
          <button className={styles.awakeButton} onClick={wakeUp}>Keep going</button>
        </div>
      }

      {(!monkey.isAwake && monkey.currentQuote) &&
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