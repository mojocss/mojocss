import Vanilla from "./utilityTypes/vanilla.js";
import Fixed from "./utilityTypes/fixed.js";
import Variable from "./utilityTypes/variable.js";
import Color from "./utilityTypes/color.js";
import StaticValues from "./staticValues.js";

/**
 * Represents a class for generating dynamic CSS.
 * @class
 */
export default class DynamicCss {
  /**
   * Initializes a new instance of DynamicCss.
   * @param {Object} args - The arguments object.
   */
  constructor(args) {
    this.args = args;

    this.StaticValues = new StaticValues(args).get();
  }

  /**
   * Gets the generated CSS based on the property and value.
   * @returns {string} The generated CSS.
   */
  getCss() {
    const classInfo = this.getClassInfo();

    if (classInfo.isFixed) {
      return new Fixed(classInfo).getCSS();
    } else if (classInfo.isVariable) {
      return new Variable(classInfo).getCSS();
    } else if (classInfo.isColor) {
      return new Color(classInfo).getCSS();
    } else {
      return new Vanilla(classInfo).getCSS();
    }
  }

  /**
   * Gets information about the class name.
   * @returns {Object} Information about the CSS class.
   */
  getClassInfo() {
    let name = this.args.name;
    let value = this.args.value;

    if (value.endsWith("-")) value = "-" + value.substring(0, value.length - 1);

    if (value.startsWith("(") && value.endsWith(")"))
      value = value.substring(1, value.length - 1);

    let forceNaN = ["flex-g", "flex-s"];

    const isNumber = !isNaN(value) && !forceNaN.includes(name);

    const isVariable = value.startsWith("--");

    let isColor = false,
      color = undefined;

    if (name.endsWith("-c")) {
      isColor = true;
    }
    if (value.startsWith("c:")) {
      value = value.substring(1);
      isColor = true;
    }
    if (isColor) {
      let valueSpl = value.split(":");
      color = valueSpl[0];

      if (valueSpl[1]) value = valueSpl[1].replace("+", "");
    }

    const fixedNames = {
      text: this.args.config.base.textDesign,
    };
    const fixed = fixedNames[name];
    const isFixed = fixed !== undefined && fixed[value] !== undefined;

    let v = value;
    let isNeg = false;
    if (!isFixed) {
      if (v.startsWith("-")) {
        v = v.substring("1");
        isNeg = true;
      }

      if (
        this.StaticValues["_"].hasOwnProperty(v) ||
        (this.StaticValues.hasOwnProperty(name) &&
          this.StaticValues[name].hasOwnProperty(v))
      ) {
        if (this.StaticValues["_"].hasOwnProperty(v)) {
          value = this.StaticValues["_"][v];
        } else {
          value = this.StaticValues[name][v];
        }
        if (isNeg) {
          value = "-" + value;
        }
      }

      let nspl = name.split("-");
      let n;
      do {
        n = nspl.shift();
      } while (n === "");

      const staticValuesIniN = this.StaticValues["_i_" + n];
      if (
        staticValuesIniN !== undefined &&
        staticValuesIniN.hasOwnProperty(v)
      ) {
        value = staticValuesIniN[v];
        if (isNeg) {
          value = "-" + value;
        }
      }
    }

    return {
      name,
      value,
      isNumber,
      isColor,
      color,
      isVariable,
      isFixed,
      fixed,
      config: this.args.config,
      isForcedValue: this.args.isForcedValue,
      appends: this.args.appends,
      props: this.args.props,
      usedColors: this.args.usedColors,
    };
  }
}
