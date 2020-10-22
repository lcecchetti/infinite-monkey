import { useState, useContext } from 'react';
import IsOnContext from "lib/IsOnContext";
import styles from 'styles/components/MonkeyOutput.module.scss';

const MonkeyOutput = ({ monkey }) => {
  const isOn = useContext(IsOnContext);
  const [monkeyEssay, setMonkeyEssay] = useState(monkey.essay);
  const [isAwake, setIsAwake] = useState(monkey.isAwake);
  const [hasMoral, setHasMoral] = useState(false);

  /**
   * Force the monkey to the next action
   * - No real monkeys were harmed during the making of this project -
   */
  const whipTheMonkey = () => {
      // monkey's next action
      monkey.do();

      // update view status
      setMonkeyEssay([...monkey.essay]);
  };

  /**
   * Toogle monkey isAwake
   */
  const toggleIsAwake = () => {
    setHasMoral(monkey.hasQuoted);

    if (!monkey.isAwake) {
      monkey.awake();
    }
    else {
      monkey.asleep();
    }

    setIsAwake(monkey.isAwake);
  };

  if (isAwake && isOn) {
    setTimeout(() => {
      whipTheMonkey();
    }, monkey.speed);
  }

  return (
    <div className={`${styles.monkeyOutput} ${isAwake ? styles.awake : styles.asleep}`}>
      <div className={styles.actions}>
        <button className={styles.awakeButton} onClick={toggleIsAwake}>{isAwake ? 'Stop The Monkey' : 'Execute Monkey Program'}</button>
      </div>
      {isAwake &&
        <div className={styles.monkeyEssay}>
          {monkeyEssay.map((char, index) => (
            char.isQuote ? <span className={styles.highlight} key={index}>{char.value}</span> : char.value
          ))}
        </div>
      }

      {!isAwake && hasMoral &&
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