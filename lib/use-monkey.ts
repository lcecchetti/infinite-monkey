import { useCallback, useEffect, useReducer, useState } from 'react';
import { EssayChar, Quote } from '@/lib/types';

/** monkey alphabet */
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ';

/** min length of a guessed quote */
const MIN_QUOTE_LENGTH = 10;

/** fixed terminal column width a line wraps at, like a real terminal */
export const LINE_LENGTH = 60;

/** how often the page wipes itself, in ms per tick - quick, not random */
export const ERASE_SPEED = 4;

/** how many characters are wiped per erase tick */
export const ERASE_CHUNK = 15;

/** number of fixed-width lines a page holds before it wipes (or ends in a quote) */
export const getMaxLines = (maxEssayLength: number): number => {
  return Math.max(1, Math.round(maxEssayLength / LINE_LENGTH));
};

/**
 * Monkey reducer action types
 */
export const monkeyActions = {
  DO: 'DO',
  ERASE: 'ERASE',
  WAKEUP: 'WAKEUP',
  SLEEP: 'SLEEP',
} as const;

interface MonkeyDoAction {
  type: typeof monkeyActions.DO;
  quotes: Quote[];
  literateRatio: number;
  maxEssayLength: number;
}

interface MonkeyEraseAction {
  type: typeof monkeyActions.ERASE;
}

interface MonkeyWakeupAction {
  type: typeof monkeyActions.WAKEUP;
}

interface MonkeySleepAction {
  type: typeof monkeyActions.SLEEP;
}

type MonkeyAction = MonkeyDoAction | MonkeyEraseAction | MonkeyWakeupAction | MonkeySleepAction;

export interface MonkeyState {
  isAwake: boolean;
  essay: EssayChar[];
  currentQuote: Quote | null;
  speed?: number;
  /** chars typed on the current, not-yet-wrapped line */
  lineLength: number;
  /** typing normally, or quickly wiping a filled page before starting a fresh one */
  phase: 'typing' | 'erasing';
}

/**
 * Get random quote
 */
const getRandomQuote = (quotes: Quote[]): Quote => {
  // get random quote
  return quotes[Math.floor(Math.random() * quotes.length)];
};

/**
 * Get random quote part
 */
const getRandomQuotePart = (quote: string): string => {
  if (quote.length <= MIN_QUOTE_LENGTH) {
    return quote.trim();
  }

  const start = Math.floor(Math.random() * (quote.length - MIN_QUOTE_LENGTH));
  const maxLength = quote.length - start;
  const length = MIN_QUOTE_LENGTH + Math.floor(Math.random() * (maxLength - MIN_QUOTE_LENGTH + 1));

  return quote.slice(start, start + length).trim();
};

/**
 * Check if the monkey should type the next char wrong
 */
const shouldTypo = (literateRatio: number, currentQuote: Quote | null): boolean => {
  if (currentQuote) {
    return !currentQuote.quote;
  }

  return Math.random() > literateRatio;
};

/**
 * Produce next essay char
 */
const type = (char: string, isQuote: boolean): EssayChar => {
  return {
    value: char,
    isQuote: isQuote
  };
};

/**
 * Get random typing speed
 */
const getRandomSpeed = (): number => {
  return (Math.random() * 1000) / 10;
};

/**
 * Get random char from the alphabet
 */
const getRandomChar = (): string => {
  return ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
};

/**
 * Initial monkey state
 */
export const monkeyInitialState: MonkeyState = {
  isAwake: false,
  essay: [],
  currentQuote: null,
  lineLength: 0,
  phase: 'typing',
};

/**
 * Monkey reducer
 */
export const monkeyReducer = (monkey: MonkeyState, action: MonkeyAction): MonkeyState => {

  switch (action.type) {

    // do next action
    case monkeyActions.DO: {
      let newChar: EssayChar;
      let currentQuote = monkey.currentQuote ? { ...monkey.currentQuote } : null;

      // check if monkey should typo or if it should quote
      if (shouldTypo(action.literateRatio, currentQuote)) {
        newChar = type(getRandomChar(), false);
      }
      else {
        // pick next quote
        if (!currentQuote) {
          currentQuote = { ...getRandomQuote(action.quotes) };
          currentQuote.quote = getRandomQuotePart(currentQuote.quote);
        }

        // pick next char from the current quote
        newChar = type(currentQuote.quote.charAt(0), true);
        currentQuote.quote = currentQuote.quote.substring(1);
      }

      const essay = [...monkey.essay, newChar];
      let lineLength = monkey.lineLength + 1;

      // wrap to a new line at a fixed column width, like a real terminal
      if (lineLength >= LINE_LENGTH) {
        essay.push(type('\n', false));
        lineLength = 0;
      }

      const maxLines = getMaxLines(action.maxEssayLength);
      const lineCount = essay.reduce((count, char) => count + (char.value === '\n' ? 1 : 0), 1);
      const quoteInProgress = !!currentQuote && currentQuote.quote !== '';

      // the page is full - but never cut a quote short: keep typing past
      // the limit until it finishes, then handle the page as usual
      if (lineCount > maxLines && !quoteInProgress) {
        // a quote finished on this page: end the run here, as if stopped by hand
        if (currentQuote) {
          return {
            ...monkey,
            currentQuote,
            essay,
            lineLength,
            isAwake: false,
          };
        }

        // no quote this page: wipe it quickly and start a fresh one
        return {
          ...monkey,
          currentQuote,
          essay,
          lineLength,
          phase: 'erasing',
        };
      }

      return {
        ...monkey,
        currentQuote,
        speed: getRandomSpeed(),
        essay,
        lineLength,
      };
    }

    // quickly erase the page a chunk at a time, then resume typing on a fresh one
    case monkeyActions.ERASE: {
      const essay = monkey.essay.slice(0, -ERASE_CHUNK);

      if (essay.length === 0) {
        return { ...monkey, essay, lineLength: 0, phase: 'typing' };
      }

      return { ...monkey, essay };
    }

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
      throw new Error(`Unknown action type: ${(action as MonkeyAction).type}`);
  }

};


/**
 * A monkey typing random keys
 * - No digital monkey was harmed in the making of this program -
 * @param quotes - list of quotes
 * @param literateRatio - how much the monkey is literate in a range from 0 to 1
 * @param maxEssayLength - size of a "page" before it wipes (or ends in a
 * quote), expressed in characters and translated into a number of fixed-width lines
 */
const useMonkey = (quotes: Quote[], literateRatio: number, maxEssayLength: number) => {

  // monkey
  const [monkey, dispatch] = useReducer(monkeyReducer, monkeyInitialState);

  // sound effect
  const [soundEffect, setSoundEffect] = useState<HTMLAudioElement>();

  /**
   * Load sound effect - deferred until the monkey first wakes up, so the
   * audio file isn't fetched on initial page load if it's never needed
   */
  useEffect(() => {
    if (!monkey.isAwake || soundEffect) {
      return;
    }

    const audio = new Audio('/audio/keyboard.mp3');
    audio.loop = true;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSoundEffect(audio);
  }, [monkey.isAwake, soundEffect])

  /**
   * Keep the sound effect in sync with the monkey's state - silent while erasing
   */
  useEffect(() => {
    if (!soundEffect) {
      return;
    }

    if (monkey.isAwake && monkey.phase === 'typing') {
      soundEffect.play();
    }
    else {
      soundEffect.pause();
    }
  }, [monkey.isAwake, monkey.phase, soundEffect]);

  /**
   * Set the monkey awake
   */
  const wakeUp = useCallback(() => {
    dispatch({ type: monkeyActions.WAKEUP });
  }, []);

  /**
   * Set the monkey asleep
   */
  const sleep = useCallback(() => {
    dispatch({ type: monkeyActions.SLEEP });
  }, []);

  /**
   * Monkey loop - types page after page while awake; once a page fills up
   * the reducer either wipes it (no quote found) or stops the monkey (it
   * quoted something), so this only ever drives DO or ERASE ticks
   */
  useEffect(() => {
    if (!monkey.isAwake) {
      return;
    }

    if (monkey.phase === 'erasing') {
      const timer = setTimeout(() => {
        dispatch({ type: monkeyActions.ERASE });
      }, ERASE_SPEED);

      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      dispatch({ type: monkeyActions.DO, quotes, literateRatio, maxEssayLength });
    }, monkey.speed);

    return () => clearTimeout(timer);
    // essay.length is the dependency that reliably changes every ERASE tick
    // (speed and phase don't change tick-to-tick while erasing), so it's
    // what keeps this effect rescheduling once a page starts wiping itself
  }, [monkey.isAwake, monkey.phase, monkey.speed, monkey.essay.length, maxEssayLength, quotes, literateRatio]);

  return { monkey, wakeUp, sleep };
};

export default useMonkey;
