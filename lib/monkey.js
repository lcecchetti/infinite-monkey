import {useEffect, useReducer, useState} from 'react';

/** @ŧype {String} - monkey alphabet */
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ';

/** @type {Number} - min length of the quote guessed */
const minQuotePatternLength = 3;

/**
 * Monkey reducer action types
 * @type {Object}
 */
const monkeyActions = {
  DO: 'DO',
  AWAKE: 'AWAKE',
  ASLEEP: 'ASLEEP',
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
 * @param {Stirng} quote
 * @return {String}
 */
const getRandomQuotePart = (quote) => {
  const sliceFrom = Math.floor(Math.random() * (quote.length - minQuotePatternLength));
  const sliceLength = Math.floor(Math.random() * quote.length + minQuotePatternLength);
  return quote.substr(sliceFrom, sliceLength).trim();
}

/**
 * Check if the monkey should type the next char wrong
 * @param {Number} literateRatio
 * @return {boolean}
 */
const shouldTypo = (literateRatio) => {
  return Math.random() > literateRatio;
};

/**
 * Prepare next essary char
 * @param {String} char
 * @param {Boolean} isQuote
 * @return {Object}
 */
const write = (char, isQuote) => {
  // produce next char
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
  return alphabet.charAt(Math.floor(Math.random() * alphabet.length));
};

/**
 * Initial monkey state
 * @type {Object}
 */
const monkeyInitialState = {
  isAwake: false,
  essay: [],
  currentQuote: '',
  hasQuoted: [],
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

      let newChar = '';
      let currentQuote = monkey.currentQuote;
      const hasQuoted = [...monkey.hasQuoted];

      // next char is random
      if (!currentQuote) {
        if (shouldTypo(monkey.literateRatio)) {
          newChar = write(getRandomChar(), false);
        } else {
          // pick next quote
          const randomQuote = getRandomQuote(monkey.quotes);

          // store current quote
          hasQuoted.push(randomQuote);

          // pick next quote
          currentQuote = getRandomQuotePart(randomQuote.quote);
        }
      }

      // next char comes from quote
      if (currentQuote) {
        newChar = write(monkey.currentQuote.charAt(0), true);
        currentQuote = currentQuote.substring(1);
      }

      // apply key press to the essay
      const essay = [...monkey.essay, newChar];

      // handle essay max length
      if (essay.length > monkey.maxEssayLength) {
        essay.shift();
      }

      // get random speed
      const speed = getRandomSpeed();

      return {
        ...monkey,
        speed,
        essay,
        currentQuote,
        hasQuoted,
      };

    // wake up the monkey
    case monkeyActions.AWAKE:
      return {
        ...monkey,
        ...monkeyInitialState,
        isAwake: true,
      };

    // make the monkey fall asleep
    case monkeyActions.ASLEEP:
      return {
        ...monkey,
        ...monkeyInitialState,
        hasQuoted: monkey.hasQuoted,
      };

    // no action found
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }

};


/**
 * A monkey typing random keys
 * @param {Array} list of quotes
 * @param {Number} maxEssayLength - max length of monkey production
 * @param {Number} literateRatio - how much the monkey is literate in a range from 0 to 1
 * @constructor
 */
const useMonkey = (quotes, maxEssayLength, literateRatio) => {
  const [monkey, dispatch] = useReducer(monkeyReducer, {
    ...monkeyInitialState,
    quotes,
    maxEssayLength,
    literateRatio,
  });

  const [soundEffect, setSoundEffect] = useState();

  /**
   * Load sound effect
   */
  useEffect(() => {
    const audio = new Audio('/audio/keyboard.mp3');
    audio.addEventListener('ended', function () {
      this.currentTime = 0;
      this.play();
    }, false);

    setSoundEffect(audio);
  }, [])

  /**
   * Set the monkey awaken
   */
  const awake = () => {
    dispatch({ type: monkeyActions.AWAKE });

    // play sound effect
    if (soundEffect) {
      soundEffect.play();
    }
  };

  /**
   * Set the monkey asleep
   */
  const asleep = () => {
    dispatch({ type: monkeyActions.ASLEEP });

    // stop sound effect
    if (soundEffect) {
      soundEffect.pause();
    }
  };

  /**
   * Monkey loop
   */
  if (monkey.isAwake) {
    setTimeout(() => {
      dispatch({ type: monkeyActions.DO });
    }, monkey.speed);
  }

  return { monkey, awake, asleep };
};

export { useMonkey };