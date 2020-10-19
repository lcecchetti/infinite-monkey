import { useState, useContext } from 'react';
import OnContext from "lib/OnContext";
import styles from 'styles/components/MonkeyEssay.module.scss';

const MonkeyEssay = ({ monkey }) => {
  const [monkeyEssay, setMonkeyEssay] = useState(monkey.essay);
  const isOn = useContext(OnContext);

  /**
   * Render monkey essay
   */
  const renderMonkeyEssay = () => (
    monkeyEssay.map((char, index) => (
      char.isQuote ? <span className={styles.highlight} key={index}>{char.value}</span> : char.value
    ))
  );

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

  // refresh
  if (isOn) {
    setTimeout(() => {
      whipTheMonkey();
    }, monkey.speed);
  }

  return (
    <div className={styles.monkeyOutput}>
      <div className={styles.monkeyEssay}>
        {renderMonkeyEssay()}
      </div>
    </div>
  );
};


export default MonkeyEssay;