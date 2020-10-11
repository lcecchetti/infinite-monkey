/**
 * A monkey typing random keys
 * @constructor
 */
const Monkey = function () {

  return {
    /** @ŧype {string} */
    output: '',
    /** @ŧype {string} */
    alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ',
    /** @type {string} */
    target: '',
    /** @type {int} - speed in ms */
    speed: 200,

    /**
     * Type the next key
     */
    pressKey: function () {
      const randomKey = this.alphabet.charAt(Math.floor(Math.random() * this.alphabet.length));
      this.output += randomKey;
    },
  }
};

export default Monkey;