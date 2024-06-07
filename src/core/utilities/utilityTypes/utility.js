import PropertyAppends from "../propertyAppends.js";

/**
 * Utility class handles the conversion of utility properties to CSS.
 * @class
 */
export default class Utility {
  /**
   * Initializes a new instance of the Utility class.
   * @param {Object} args - Arguments for utility conversion.
   */
  constructor(args) {
    this.args = args;
    if (!Array.isArray(this.args.props)) {
      this.args.props = [this.args.props];
    }
  }

  /**
   * Converts a utility property and its value to CSS format.
   * @param {string} prop - The utility property.
   * @param {string} value - The value of the property.
   * @param {string} prepend - Text to prepend to the CSS string.
   * @param {string} append - Text to append to the CSS string.
   * @returns {string} - CSS representation of the utility property.
   */
  toCss(prop, value, prepend = "", append = "") {
    let ret = `${prop}: ${value}`;

    if (prepend) {
      ret = `${prepend};${ret}`;
    }

    const setAppend = (obj) => {
      if(typeof obj === "string"){
        append += obj;
      } else {
        append += Object.entries(obj)
          .map(([i, val]) => this.toCss(i, val))
          .join(';');
      }
    }

    if (PropertyAppends) {
      if(prop.includes("--m-")) {
        for (const key in PropertyAppends) {
          if (prop.includes(key)) {
            setAppend(PropertyAppends[key])
          }
        }
      } else if(PropertyAppends[prop]) {
        setAppend(PropertyAppends[prop]);
      }
    }

    if (append) {
      ret = `${ret};${append}`;
    }

    return ret;
  }

}
