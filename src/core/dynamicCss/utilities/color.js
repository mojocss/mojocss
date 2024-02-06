import Utility from "./utility.js";
import ColorConverter from "../../utils/colorConverter.js";
import Vanilla from "./vanilla.js";

export default class Color extends Utility {
  getCSS() {
    let props = this.args.props;
    let value = this.args.value;
    let config = this.args.config;
    let colorName = this.args.color;

    let isConfigColor = config.base.themes.default[colorName] !== undefined;

    let isMidColor = false;

    let alphaValue = 1;
    let isAlphaAppended = false;
    if (
      this.args.appends &&
      this.args.appends[0] &&
      !isNaN(this.args.appends[0])
    ) {
      alphaValue = parseInt(this.args.appends[0]) / 100;
      isAlphaAppended = true;
    }

    let css = "",
      isFirst = true;
    if (isConfigColor) {
      if (this.args.usedColors[colorName] === undefined) {
        this.args.usedColors[colorName] = new Set();
      }

      let cvar = "--m-color-" + colorName;
      if (colorName !== value && !isNaN(value)) {
        if (value > 0) cvar += "-l-" + value;
        else if (value < 0) cvar += "-d" + value;

        this.args.usedColors[colorName].add(value);
      } else {
        this.args.usedColors[colorName].add(0);
      }
      cvar = cvar.replace(/\./g, "-");

      let alphaProp = `--m-${this.args.name}-alpha`;

      for (let i of props) {
        if (isFirst) isFirst = false;
        else css += ";";
        if (i.includes("mid")) isMidColor = true;
        css += this.toCss(
          i,
          `rgba(var(${cvar}),var(${alphaProp}))${isMidColor ? "," : ""}`,
          this.toCss(alphaProp, alphaValue)
        );
      }

      return css;
    } else {
      let rawColor = this.args.value.split(":");

      let func = rawColor[1];
      let color;
      if (func === undefined) {
        if (colorName !== undefined) {
          color = ColorConverter.parseColor(colorName);
          if (colorName !== value && !isNaN(value)) {
            value = parseInt(value);
            if (value > 0)
              color = ColorConverter.lighten(
                colorName,
                value * this.args.config.base.units.lighten
              );
            else if (value < 0) {
              color = ColorConverter.darken(
                colorName,
                -value * this.args.config.base.units.darken
              );
            }
          }
        } else {
          color = ColorConverter.parseColor(value);
        }
      } else {
        let inputColor = ColorConverter.parseColor(`${rawColor[0]}`);
        let inputFunc = func.replace(/\+/g, "");
        inputFunc = inputFunc.replace("-", "");
        color = inputColor;
        let count = parseInt(inputFunc) + 1;
        if (func.startsWith("+")) {
          for (let i = 1; i < count; i++) {
            color = ColorConverter.lighten(
              rawColor[0],
              i * this.args.config.base.units.lighten
            );
          }
        } else {
          for (let i = 1; i < count; i++) {
            color = ColorConverter.darken(
              rawColor[0],
              -i * this.args.config.base.units.darken
            );
          }
        }
      }

      if (!color) return new Vanilla(this.args).getCSS();

      let alphaProp = `--m-${this.args.name}-alpha`;

      for (let i of props) {
        if (isFirst) isFirst = false;
        else css += ";";
        if (i.includes("mid")) isMidColor = true;
        css += this.toCss(
          i,
          `rgba(${color[0]}, ${color[1]}, ${color[2]}, var(${alphaProp}))${
            isMidColor ? "," : ""
          }`,
          this.toCss(alphaProp, isAlphaAppended ? alphaValue : color[3])
        );
      }

      return css;
    }
  }
}
