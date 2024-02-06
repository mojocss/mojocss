import Utility from "./utility.js";

export default class Variable extends Utility{
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
