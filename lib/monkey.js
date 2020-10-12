/**
 * A monkey typing random keys
 * @param {string} masterpiece - piece of literature that the monkey has to produce
 * @param {float} literateRatio - how much the monkey is literate in a range from 0 to 1
 * @constructor
 */
const Monkey = function (masterpiece, literateRatio) {

  return {

    /** @ŧype {string} - monkey alphabet */
    alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-:.,;?\'\" \n',
    /** @ŧype {string} - written essay */
    essay: '',
    /** @type {int} - speed in ms */
    speed: 200,
    /** @type {boolean} - the monkey is currently deleting */
    isDeleting: false,
    /** @type {int} - longest achieved essay length */
    longestProduction: 0,

    /**
     * Do next action
     */
    do: function () {

      // press keyboard key
      this.pressKey();

      // proofread the essay
      this.proofRead();

      // update typing speed
      this.updateSpeed();
    },

    /**
     * Type the next key
     */
    pressKey: function () {

      // force backspace during deletion
      if (this.isDeleting) {
        this.delete();
        return ;
      }

      if (this.shouldTypo()) {
        // type a random key from the alphabet
        this.essay += this.alphabet.charAt(Math.floor(Math.random() * this.alphabet.length));
      } else {
        // type the correct key by cheating
        this.essay += masterpiece[this.essay.length];
      }
    },

    /**
     * Define if the monkey should type wrong
     */
    shouldTypo: function () {
      return Math.random() > literateRatio;
    },

    /**
     * Delete last essay char
     */
    delete: function () {

      // delete
      if (this.essay.length > 0) {
        this.essay = this.essay.slice(0, -1);
      }
    },

    /**
     * Proof read the essay
     */
    proofRead: function () {

      // check if deletion should stop
      if (this.isDeleting && this.essay.length == 0) {
        this.isDeleting = false;
        return;
      }

      // proof read last char
      if (this.essay[this.essay.length - 1] != masterpiece[this.essay.length - 1]) {
        this.isDeleting = true;
        return;
      }

      // store the longest production
      if (this.essay.length > this.longestProduction) {
        this.longestProduction = this.essay.length;
      }
    },

    /**
     * Update typing speed
     */
    updateSpeed: function () {
      if (this.isDeleting) {
        // deletion speed
        this.speed = (Math.random() * 1000) / 20 + 10;
      } else {
        // typing speed
        this.speed = (Math.random() * 1000) / 5 + 50;
      }
    },
  }
};

export default Monkey;