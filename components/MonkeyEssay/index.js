import { useEffect, useState } from 'react';

const MonkeyEssay = ({ monkey }) => {
  const [monkeyEssay, setMonkeyEssay] = useState(monkey.essay);

  /**
   * Force the monkey to the next action
   * - No real monkeys were harmed during the making of this project -
   */
  function whipTheMonkey() {
    // ask the monkey for the next action
    monkey.do();

    // update view status
    setMonkeyEssay(monkey.essay);
  }

  useEffect(() => {
    const monkeyAwaken = setInterval(() => {
      whipTheMonkey();
    }, monkey.speed);

    return () => clearInterval(monkeyAwaken);
  });

  return (
    <span>{monkeyEssay}</span>
  );
};


export default MonkeyEssay;