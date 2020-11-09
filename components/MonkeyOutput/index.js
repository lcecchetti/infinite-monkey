import { useState, useContext } from 'react';
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
          <p>Are you SURPRISED? You didn't think that the monkey would have written anything meaningful, didn't you?</p>
          <p>But what is truly suprising?</p>
          <p>The fact that the MONKEY did quote the hamlet? Or the fact that this branch of the UNIVERSE wrote down this program? Or that YOU are actually here, in front of the screen, reading a MONKEY quoting the HAMLET?</p>
        </div>
      }

    </div>
  );
};


export default MonkeyOutput;