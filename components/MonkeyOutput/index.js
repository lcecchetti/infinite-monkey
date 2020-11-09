import { useContext } from 'react';
import IsOnContext from "lib/IsOnContext";
import { useMonkey } from "lib/monkey";
import styles from 'styles/components/MonkeyOutput.module.scss';

const MonkeyOutput = ({ quotes, maxEssayLength, literateRatio }) => {
  const isOn = useContext(IsOnContext);
  const { monkey, awake, asleep } = useMonkey(quotes, maxEssayLength, literateRatio);

  /**
   * Toogle monkey isAwake
   */
  const toggleIsAwake = () => {
    if (!monkey.isAwake) {
      awake();
    }
    else {
      asleep();
    }
  };

  // stop the monkey if monitor is off
  if (!isOn && monkey.isAwake) {
    asleep();
  }

  return (
    <div className={`${styles.monkeyOutput} ${monkey.isAwake ? styles.awake : styles.asleep}`}>

      <div className={styles.actions}>
        <button className={styles.awakeButton} onClick={toggleIsAwake}>{monkey.isAwake ? 'Stop The Monkey' : 'Execute Monkey Program'}</button>
      </div>

      {monkey.isAwake &&
        <div className={styles.monkeyEssay}>
          {monkey.essay.map((char, index) => (
            char.isQuote ? <span className={styles.highlight} key={index}>{char.value}</span> : char.value
          ))}
        </div>
      }

      {!monkey.isAwake && monkey.hasQuoted &&
        <div className={styles.moral}>
          <p>Congratulations, your MONKEY instance did quote the HAMLET.</p>
          <p>
            But is that truly unexpected?<br/>
            What about this text? What about this program?<br/>
            What about you?
          </p>
          <p>Isn't this just the latest edge of this branch of the universe?</p>
          <p>CHAOS reading CHAOS writings.</p>
        </div>
      }

    </div>
  );
};


export default MonkeyOutput;