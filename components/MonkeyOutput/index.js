import { useEffect, useState } from 'react';
import Monkey from 'lib/monkey';

// a monkey
var monkey = new Monkey();

const MonkeyOutput = ({ target }) => {
  const [monkeyOutput, setMonkeyOutput] = useState(monkey.output);

  /**
   * Force the monkey to the next action
   * - No real monkeys were harmed during the making of this project -
   */
  function whipTheMonkey() {
    monkey.pressKey();

    // update view status
    setMonkeyOutput(monkey.output);
  }

  useEffect(() => {
    const monkeyAwake = setInterval(() => {
      whipTheMonkey();
    }, monkey.speed);

    return () => clearInterval(monkeyAwake);
  });

  return (
    <span>{monkeyOutput}</span>
  );
};


export default MonkeyOutput;