import Utility from "./utility.js";

/**
 * Variable utility class extends the Utility class and handles the conversion of variable utilities to CSS.
 * @class
 */
export default class Variable extends Utility{
  /**
   * Generates CSS for variable utilities.
   * @returns {string} - CSS representation of the variable utility.
   */
  getCSS() {
    const { props, value } = this.args;
    let css = "";
    let isFirst = true;

    for (const prop of props) {
      if (!isFirst) {
        css += ";";
      } else {
        isFirst = false;
      }

      css += this.toCss(prop, `var(${value})`);
    }

    return css;
  }
}
