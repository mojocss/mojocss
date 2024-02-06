import Utility from "./utility.js";
import defaults from "../defaults.js";

export default class Vanilla extends Utility {
  getCSS() {
    let name = this.args.name;
    let props = this.args.props;
    let value = this.args.value;
    let config = this.args.config;

    let css = "";
    let isFirst = true;

    value = value
      .toString()
      .replace(/([^\\])_/g, "$1 ")
      .replace(/\\_/g, "_");

    value = value.includes("calc")
      ? value.replace(
          /(?<!calc\()var\(--\w+?(?:-\w+?)*\)(?!\))|[+\-*/]/g,
          (m) => (m.startsWith("var(") ? m : ` ${m} `)
        )
      : value;

    for (let prop in props) {
      if(props.hasOwnProperty(prop)) {
        if (!isFirst) {
          css += ";";
        }
        const propValue = this.args.isNumber
          ? this.getValueUnit(name, props[prop], value, config, defaults)
          : this.getValue(name, props[prop], value, config, defaults);

        css += this.toCss(props[prop], propValue);

        isFirst = false;
      }
    }

    return css;
  }

  getValueUnit(name, prop, value, config, defaults) {
    if (this.args.isForcedValue) return this.proccessVariables(prop, value);
    let size = config.base.units.sizing;
    let changeNeeded = true;
    let modifiedValue = false;
    if (prop.startsWith("--m-t-scale")) size = config.base.units.scale;
    if (prop.includes("transition")) size = config.base.units.transition;
    if (prop.includes("radius")) size = config.base.units.rounded;
    if (prop.includes("alpha") || prop.includes("opacity")) size = 0.01;
    if (
      prop.startsWith("z-index") ||
      prop.startsWith("font-weight") ||
      prop.startsWith("order")
    )
      size = 1;
    if (prop.startsWith("font-size")) size = config.base.units.fontSize;
    if (
      (prop.includes("border") || prop.includes("outline")) &&
      prop.includes("width")
    ) {
      size = 1 + "px";
    }

    if (prop === "outline-width") {
      changeNeeded = false;
      value = value + "px;outline-style:solid";
    }
    if (prop.includes("grid")) {
      changeNeeded = false;
      if (name === "cols" || name === "rows")
        value = `repeat(${value}, minmax(0, 1fr))`;
      if (name === "col" || name === "c-span" || name === "r-span")
        value = `auto / span ${value}`;
      if (name === "col-offset") value = parseInt(value) + 1;
    }
    if (prop.startsWith("--m-f-") || prop.startsWith("--m-bf-")) {
      changeNeeded = false;
      let f_value = value / 100;
      if (prop.includes("blur")) f_value = value + "px";
      if (prop.includes("rotate")) f_value = value + "deg";
      value = `${name.replace("backdrop-", "")}(${f_value})`;
    }

    if (prop.startsWith("--m-f-")) {
      changeNeeded = false;
      value = `${value};${defaults[0]}`;
    }
    if (prop.startsWith("--m-bf-")) {
      changeNeeded = false;
      value = `${value};${defaults[1]}`;
    }
    if (prop.startsWith("--m-t-") && !prop.includes("-translate")) {
      if (prop.includes("t-rotate") || prop.includes("t-skew")) {
        changeNeeded = false;
        value = `${value}deg;${defaults[2]}`;
      } else modifiedValue = true;
    }

    if (name === "shadow-solid") {
      changeNeeded = false;
      value = `0 0 0 ${value}px var(--m-shadow-color, #000)`;
    }
    if (name === "shadow") {
      changeNeeded = false;
      let shadowArr = config.base.definedValues.boxShadow;
      for (let i in shadowArr) {
        if (i === value) value = shadowArr[i];
      }
    }

    if (changeNeeded) {
      let com = parseFloat(size);
      if (com !== size) {
        let unit = size.replace(com.toString(), "");
        if (prop.includes("-translate"))
          value =
            (parseFloat(value) * com).toString() + unit + ";" + defaults[2];
        else value = (parseFloat(value) * com).toString() + unit;
      } else {
        value = (parseFloat(value) * com).toString();
      }
      if (modifiedValue) {
        value = `${value};${defaults[2]}`;
      }
    }

    return value;
  }

  getValue(name, prop, value, config, defaults) {
    if (this.args.isForcedValue) return this.proccessVariables(prop, value);

    let v = value;
    let isNeg = false;
    if (v.startsWith("-")) {
      v = v.substring(1);
      isNeg = true;
    }
    if (
      value !== "default" &&
      this.args.config.base.breakpoints[v] !== undefined &&
      this.args.config.base.breakpoints[v].container !== undefined &&
      this.args.config.base.breakpoints[v].container.maxWidth !== undefined
    ) {
      value = this.args.config.base.breakpoints[v].container.maxWidth;
      if (isNeg) value = "-" + value;
    }

    if (!Array.isArray(this.args.props) && this.args.props.startsWith(":"))
      this.args.props = this.args.props.substring(1);

    if (name === "gd-dir") {
      if (!value.includes("deg")) value = "to " + value.replace(/-/g, " ");
    }
    if (
      prop === "background-position" ||
      name === "transform-o" ||
      name === "perspective-o" ||
      name === "flex" ||
      name === "obj-p"
    )
      value = value.replace(/-/g, " ");
    if (name.includes("bg-img")) value = "url('" + value + "')";
    if (
      name.includes("bg-o") ||
      (name.includes("bg-clip") && value !== "text") ||
      name.includes("box-s")
    )
      value = value + "-box";
    if (name.includes("bg-clip") && value === "text")
      value = value + ";-webkit-background-clip: text";
    if (value === "current") value = "currentColor";
    if (value.toString().includes("calc")) {
      value = value
        .replace(/\+/g, " + ")
        .replace(/-/g, " - ")
        .replace(/\*/g, " * ")
        .replace(/\//g, " / ");
    }
    if (name === "d" && value.includes("flex"))
      value = `${value};--m-box-start: flex-start;--m-box-end: flex-end`;
    if (name === "d" && value.includes("grid"))
      value = `${value};--m-box-start: start;--m-box-end: end`;
    if (
      name.startsWith("a-") ||
      name.startsWith("j-") ||
      name.startsWith("p-")
    ) {
      if (value.includes("start") || value.includes("end"))
        value = `var(--m-box-${value})`;
      if (
        value.includes("between") ||
        value.includes("around") ||
        value.includes("evenly")
      )
        value = `space-${value}`;
    }
    if (prop === "outline-width") {
      value = value + ";outline-style:solid";
    }
    if (prop.startsWith("--m-f-") || prop.startsWith("--m-bf-"))
      value = `${name.replace("backdrop-", "")}(${value})`;

    if (prop.startsWith("--m-f-")) value = `${value};${defaults[0]}`;
    if (prop.startsWith("--m-bf-")) value = `${value};${defaults[1]}`;
    if (prop.startsWith("--m-t-")) value = `${value};${defaults[2]}`;

    if (name === "animation") {
      let animArr = config.base.definedValues.animation;
      for (let i in animArr) {
        if (i === value) {
          value = `m-${i} ${animArr[i].dur}`;
        }
      }
    }

    if (name === "shadow" && !value.startsWith("var")) {
      let shadowArr = config.base.definedValues.boxShadow;
      for (let i in shadowArr) {
        if (i === value) {
          value = shadowArr[i];
        }
      }
    }
    if (name === "shadow-solid")
      value = `0 0 0 ${value} var(--m-shadow-color, #000)`;
    if (name === "font") {
      const fontArr = config.base.fonts;
      const fontValue = fontArr[value];

      if (fontValue !== undefined) {
        value = Array.isArray(fontValue)
          ? fontValue.join(",")
          : typeof fontValue === "object"
          ? Object.keys(fontValue).join(",")
          : fontValue;
      } else {
        value = "";
      }
    }
    return value;
  }

  proccessVariables(prop, value) {
    if (prop.startsWith("--m")) {
      value = `${prop.replace(/--m-[^-]+-(\w+)/g, "$1")}(${value})`;
    }
    const pattern = /\$[a-zA-Z_][a-zA-Z0-9_.]*/g;
    const colorRegex = /\$c\.(\w+)/g;

    function replaceColorName(match) {
      const parts = match.split(".");
      if (parts.length === 2) {
        return "$base.themes.default." + parts[1];
      } else if (parts.length === 3) {
        return "$base.themes." + parts[1];
      } else {
        return match;
      }
    }

    if (value.includes("$"))
      value = value.replace(pattern, (match) => {
        if (match.startsWith("$c.")) {
          match = match.replace(colorRegex, replaceColorName(match));
        }
        if (match.startsWith("$u.")) {
          match = match.replace("$u.", "$base.units.");
        }
        match = match.substring(1);
        let currentObject = this.args.config;
        const keys = match.split(".");

        for (const key of keys) {
          if (currentObject[key]) {
            currentObject = currentObject[key];
          } else {
            currentObject = undefined;
            break;
          }
        }

        if (currentObject === undefined) {
          console.warn("Variable $" + match + " is not defined.");
        }

        return currentObject !== undefined ? currentObject : "";
      });

    return value;
  }
}
