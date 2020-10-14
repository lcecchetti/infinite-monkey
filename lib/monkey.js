/**
 * A monkey typing random keys
 * @param {array} list of quotes
 * @param {int} maxEssayLength - max length of monkey production
 * @param {float} literateRatio - how much the monkey is literate in a range from 0 to 1
 * @constructor
 */
const Monkey = function (quotes, maxEssayLenght, literateRatio) {

  return {

    /** @ŧype {string} - monkey alphabet */
    alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-:.,;?\'\" ',
    /** @ŧype {array} - list of essay chars */
    essay: [],
    /** @type {int} - speed in ms */
    speed: 0,
    /** @type {string} - current quote part being guessed */
    currentQuotePart: '',
    /** @type {int} - min length of the quote guessed */
    minQuotePatternLength: 3,

    /**
     * Do next action
     */
    do: function () {

      // press keyboard key
      this.pressKey();

      // update typing speed
      this.updateSpeed();
    },

    /**
     * Type the next key
     */
    pressKey: function () {

      // make space for the next char
      if (this.essay.length > maxEssayLenght) {
        this.essay.shift();
      }

      // keep writing the current quote
      if (this.currentQuotePart) {
        // force the next char from the current quote part
        this.write(this.currentQuotePart.charAt(0), true);

        // remove the char from the quote part
        this.currentQuotePart = this.currentQuotePart.substring(1);
        return;
      }

      if (this.shouldTypo()) {
        // monkey will typo next char
        const randomChar = this.alphabet.charAt(Math.floor(Math.random() * this.alphabet.length));
        this.write(randomChar, false);
      }
      else {
        // prepare next quote part to produce
        this.updateCurrentQuote();
      }
    },

    /**
     * Update current quote
     */
    updateCurrentQuote: function () {
      // get random quote
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

      // get random quote part
      const sliceFrom = Math.floor(Math.random() * (randomQuote.length - this.minQuotePatternLength));
      const sliceLength = Math.floor(Math.random() * randomQuote.length + this.minQuotePatternLength);
      const randomQuotePart = randomQuote.substr(sliceFrom, sliceLength);

      // update current quote
      this.currentQuotePart = randomQuotePart;
    },

    /**
     * Define if the monkey should type wrong
     */
    shouldTypo: function () {
      return Math.random() > literateRatio;
    },

    /**
     * Write the next essay char
     */
    write: function (char, isQuote) {

      // porduce next char
      const nextChar = {
        value: char,
        isQuote: isQuote
      }

      // update essay
      this.essay.push(nextChar);
    },

    /**
     * Update typing speed
     */
    updateSpeed: function () {
      this.speed = (Math.random() * 1000) / 10;
    },
  }
};

export default Monkey;