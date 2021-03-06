import {useEffect, useReducer, useState} from 'react';

/** @ŧype {String} - monkey alphabet */
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ';

/** @type {Number} - min length of the quote guessed */
const MIN_QUOTE_LENGTH = 10;

/**
 * Monkey reducer action types
 * @type {Object}
 */
const monkeyActions = {
  DO: 'DO',
  WAKEUP: 'WAKEUP',
  SLEEP: 'SLEEP',
};

/**
 * Get random quote
 * @param {Array} quotes
 * @return {String}
 */
const getRandomQuote = (quotes) => {
  // get random quote
  return quotes[Math.floor(Math.random() * quotes.length)];
};

/**
 * Get random quote part
 * @param {String} quote
 * @return {String}
 */
const getRandomQuotePart = (quote) => {
  const sliceFrom = Math.floor(Math.random() * (quote.length - MIN_QUOTE_LENGTH));
  const sliceLength = Math.floor(Math.random() * quote.length + MIN_QUOTE_LENGTH);
  return quote.substr(sliceFrom, sliceLength).trim();
}

/**
 * Check if the monkey should type the next char wrong
 * @param {Number} literateRatio
 * @param {Object} currentQuote
 * @return {Boolean}
 */
const shouldTypo = (literateRatio, currentQuote) => {
  if (currentQuote) {
    return !currentQuote.quote;
  }

  return Math.random() > literateRatio;
};

/**
 * Produce next essay char
 * @param {String} char
 * @param {Boolean} isQuote
 * @return {Object}
 */
const type = (char, isQuote) => {
  return {
    value: char,
    isQuote: isQuote
  };
};

/**
 * Get random typing speed
 * @return {Number}
 */
const getRandomSpeed = () => {
  return (Math.random() * 1000) / 10;
};

/**
 * Get random char from the alphabet
 * @return {String}
 */
const getRandomChar = () => {
  return ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
};

/**
 * Initial monkey state
 * @type {Object}
 */
const monkeyInitialState = {
  isAwake: false,
  essay: [],
  currentQuote: null,
};

/**
 * Monkey reducer
 * @param {Object} monkey
 * @param {Object} action
 * @return {Object}
 */
const monkeyReducer = (monkey, action) => {

  switch (action.type) {

    // do next action
    case monkeyActions.DO:
      let newChar;
      let currentQuote = monkey.currentQuote ? {...monkey.currentQuote} : null;

      // check if monkey should typo or if it should quote
      if (shouldTypo(monkey.literateRatio, currentQuote)) {
        newChar = type(getRandomChar(), false);
      }
      else {
        // pick next quote
        if (!currentQuote) {
          currentQuote = {...getRandomQuote(monkey.quotes)};
          currentQuote.quote = getRandomQuotePart(currentQuote.quote);
        }

        // pick next char from the current quote
        newChar = type(currentQuote.quote.charAt(0), true);
        currentQuote.quote = currentQuote.quote.substring(1);
      }

      return {
        ...monkey,
        currentQuote,
        speed: getRandomSpeed(),
        essay: [...monkey.essay, newChar],
      };

    // wake up the monkey
    case monkeyActions.WAKEUP:
      return {
        ...monkey,
        ...monkeyInitialState, // reset
        isAwake: true,
      };

    // make the monkey fall asleep
    case monkeyActions.SLEEP:
      return {
        ...monkey,
        isAwake: false,
      };

    // no action found
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }

};


/**
 * A monkey typing random keys
 * - No digital monkey was harmed in the making of this program -
 * @param {Array} list of quotes
 * @param {Number} literateRatio - how much the monkey is literate in a range from 0 to 1
 * @param {Number} maxEssayLength - maximum length of the essay before taking a break
 * @constructor
 */
const useMonkey = (quotes, literateRatio, maxEssayLength) => {

  // monkey
  const [monkey, dispatch] = useReducer(monkeyReducer, {
    ...monkeyInitialState,
    quotes,
    literateRatio,
  });

  // sound effect
  const [soundEffect, setSoundEffect] = useState();

  /**
   * Load sound effect
   */
  useEffect(() => {
    const audio = new Audio('/audio/keyboard.mp3');
    // set soudn effect to loop
    audio.addEventListener('ended', function () {
      this.currentTime = 0;
      this.play();
    }, false);

    setSoundEffect(audio);
  }, [])

  /**
   * Set the monkey awaken
   */
  const wakeUp = () => {
    dispatch({ type: monkeyActions.WAKEUP });

    // play sound effect
    if (soundEffect) {
      soundEffect.play();
    }
  };

  /**
   * Set the monkey asleep
   */
  const sleep = () => {
    dispatch({ type: monkeyActions.SLEEP });

    // pause sound effect
    if (soundEffect) {
      soundEffect.pause();
    }
  };

  /**
   * Monkey loop
   */
  if (monkey.isAwake) {
    if (monkey.essay.length < maxEssayLength) {
      setTimeout(() => {
        dispatch({ type: monkeyActions.DO });
      }, monkey.speed);
    }
    else {
      sleep();
    }
  }

  return { monkey, wakeUp, sleep };
};

export default useMonkey;