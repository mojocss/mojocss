import Utility from "./utility.js";
import { toHsl } from "../colorConverter.js";

/**
 * Color utility class extends the Utility class and handles the conversion of color utilities to CSS.
 * @class
 */
export default class Color extends Utility {
  /**
   * Generates CSS for color utilities.
   * @returns {string} - CSS representation of the color utility.
   */
  getCSS() {
    const args = this.args;
    const css = [];
    let { props, value, config, color } = args;
    const {lighten , darken} = config.base.units;

    let grade = 0;
    if (color !== value && !isNaN(value)) {
      grade = parseFloat(value);
    }
    grade = grade > 0 ? lighten * grade : darken * grade;

    let alphaValue = 1;
    if (args.appends && args.appends[0] && !isNaN(args.appends[0])) {
      alphaValue = (parseInt(args.appends[0]) / 100).toFixed(2);
    }

    let isConfigColor = config.base.themes.default[color] !== undefined;

    let alphaProp = `--m-${args.name}-alpha`;
    let lightnessProp = `--m-${args.name}-lightness`;
    let lightnessValue = grade + "%";

    if(color.trim() !== "") {
      let colorValue, lightness;
      if (isConfigColor) {
        if (!args.usedColors.includes(color)) {
          args.usedColors.push(color);
        }

        colorValue = `var(--m-color-${color})`;
        lightness = `var(--m-color-${color}-l)`;
      } else {
        const result = toHsl(color);
        if (Array.isArray(result)) {
          colorValue = `${result[0]}, ${result[1]}%`;
          lightness = result[2] + `%`;
        }
      }

      let value = colorValue ? `hsla(${colorValue}, calc(${lightness} + var(${lightnessProp})), var(${alphaProp}))` : color !== "current" ? color : "currentColor";

      for (let i of props) {
        if (i.includes("mid")) value += ",";

        css.push(
          this.toCss(
            i,
            value,
            colorValue ? this.toCss(alphaProp, alphaValue.toString(), this.toCss(lightnessProp, lightnessValue)) : undefined
          )
        );
      }
    } else {
      css.push(this.toCss(lightnessProp, lightnessValue, alphaValue !== 1 ? this.toCss(alphaProp, alphaValue.toString()) : undefined));
    }

    return css.join(";");
  }
}
