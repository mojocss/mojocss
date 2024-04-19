import Utility from "./utility.js";

/**
 * Fixed utility class extends the Utility class and handles the conversion of fixed utilities to CSS.
 * @class
 */
export default class Fixed extends Utility {
  /**
   * Generates CSS for fixed utilities.
   * @returns {string} - CSS representation of the fixed utility.
   */
  getCSS() {
    const {fixed, value} = this.args;

    let css = "";

    css += Object.entries(fixed[value])
      .map(([key, val]) => this.toCss(key.replace(/[A-Z]/g, m => "-" + m.toLowerCase()), val))
      .join(';');


    return css;
  }
}
