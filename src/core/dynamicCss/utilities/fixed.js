import Utility from "./utility.js";

export default class Vanilla extends Utility {
  getCSS() {
    let fixed = this.args.fixed;
    let value = this.args.value;

    let css = "";

    css += Object.entries(fixed[value])
      .map(([key, val]) => this.toCss(key.replace(/[A-Z]/g, m => "-" + m.toLowerCase()), val))
      .join(';');


    return css;
  }
}
