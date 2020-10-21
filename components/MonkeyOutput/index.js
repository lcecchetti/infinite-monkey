import { useState, useContext } from 'react';
import IsOnContext from "lib/IsOnContext";
import styles from 'styles/components/MonkeyEssay.module.scss';

const MonkeyOutput = ({ monkey }) => {
  const [monkeyEssay, setMonkeyEssay] = useState(monkey.essay);
  const [isAwake, setIsAwake] = useState(monkey.isAwake);
  const isOn = useContext(IsOnContext);

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
    </div>
  );
};


export default MonkeyOutput;