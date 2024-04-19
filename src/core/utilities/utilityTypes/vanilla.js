import Utility from "./utility.js";

/**
 * Vanilla utility class extends the Utility class and handles the conversion of vanilla utilities to CSS.
 * @class
 */
export default class Vanilla extends Utility {
  /**
   * Generates CSS for vanilla utilities.
   * @returns {string} - CSS representation of the vanilla utility.
   */
  getCSS() {
    const args = this.args;
    let { name, props, value } = args;

    let css = "";
    let isFirst = true;

    value = value
      .toString()
      .replace(/([^\\])_/g, "$1 ")
      .replace(/\\_/g, "_");

    value = value.includes("calc")
      ? value.replace(
          /(?!calc\()var\(--\w+?(?:-\w+?)*\)(?!\))|[+\-*/]/g,
          (m) => (m.startsWith("var(") ? m : ` ${m} `)
        )
      : value;

    for (let prop in props) {
      if (props.hasOwnProperty(prop)) {
        if (!isFirst) {
          css += ";";
        }
        const propValue = this.processProp(name, props[prop], value);

        css += this.toCss(props[prop], propValue);

        isFirst = false;
      }
    }

    return css;
  }

  /**
   * Processes the value of the utility property based on its name and value.
   * @param {string} name - Name of the utility.
   * @param {string} prop - Property of the utility.
   * @param {string} value - Value of the utility.
   * @returns {string} - Processed value of the utility property.
   */
  processProp(name, prop, value) {
    if (this.args.isForcedValue) return this.processVariables(prop, value);

    const { args } = this,
      { units, definedValues, fonts, breakpoints } = args.config.base;
    let factor = 0,
      template;

    let propMappings = {
      "--m-f-": { t: `${name}(%d)` },
      "--m-bf-": { t: `${name.replace("backdrop-", "")}(%d)` },
      "--m-t-": { t: `%d` },
      "outline-width": { t: `%d;outline-style:solid` },
    };
    let nameMappings = {
      shadow: {
        f: "0",
        v:
          definedValues.boxShadow[value] && !value.startsWith("var")
            ? definedValues.boxShadow[value]
            : value,
      },
    };

    if (args.isNumber) {
      factor = units.sizing;

      propMappings = {
        ...propMappings,
        gap: { f: units.sizing },
        transition: { f: units.transition },
        radius: { f: units.rounded },
        "font-size": { f: units.fontSize },
        "z-index|font-weight": { f: "1" },
        "alpha|opacity": { f: 0.01 },
        "border|outline-width": { f: "1px" },
        order: { f: "1" },
        grid: { f: "0" },
      };
      propMappings["--m-f-"].f =
        propMappings["--m-bf-"].f =
        propMappings["--m-t-"].f =
          "0.01";

      nameMappings = {
        ...nameMappings,
        "col|c-span|r-span": { f: "0", t: `auto / span %d` },
        "cols|rows": { f: "0", t: `repeat(%d, minmax(0, 1fr))` },
        "col-offset": { f: "0", v: parseInt(value) + 1 },
        "blur|backdrop-blur": { f: "1px" },
        "scale|scale-x|scale-y": { f: units.scale },
        "rotate|skew-x|skew-y": { f: "1deg" },
        "hue-rotate|backdrop-hue-rotate": { f: "1deg" },
        "translate-x|translate-y": { f: units.sizing },
        outline: { f: "1px" },
        "shadow-solid": { f: "1px", t: `0 0 0 %d var(--m-shadow-color, #000)` },
      };
    } else {
      propMappings = {
        ...propMappings,
        "-items|-content|-self": {
          t:
            value.includes("start") || value.includes("end")
              ? `var(--m-box-%d)`
              : value.includes("between") ||
                value.includes("around") ||
                value.includes("evenly")
              ? "space-%d"
              : null,
        },
      };

      nameMappings = {
        ...nameMappings,
        "gd-dir": {
          v: value.includes("deg") ? value : "to " + value.replace(/-/g, " "),
        },
        "bg-p|transform-o|perspective-o|flex|obj-p": {
          v: value.replace(/-/g, " "),
        },
        "bg-img": { t: `url('%d')` },
        "bg-o|bg-clip|box-s": {
          v: value === "text" ? value : value + "-box",
          t: value === "text" ? "%d;-webkit-background-clip: text" : null,
        },
        d: {
          t:
            value === "flex"
              ? "%d;--m-box-start: flex-start;--m-box-end: flex-end"
              : value === "grid"
              ? "%d;--m-box-start: start;--m-box-end: end"
              : null,
        },
        animation: {
          v: definedValues.animation[value]
            ? `m-${value} ` + definedValues.animation[value].dur
            : value,
        },
        font: {
          v: fonts[value]
            ? Array.isArray(fonts[value])
              ? fonts[value].join(",")
              : typeof fonts[value] === "object"
              ? Object.keys(fonts[value]).join(",")
              : fonts[value]
            : value,
        },
      };

      if (!Array.isArray(args.props) && args.props.startsWith(":"))
        args.props = args.props.substring(1);

      let isNeg = false,
        v = value;
      if (v.startsWith("-")) {
        v = v.substring(1);
        isNeg = true;
      }
      const maxWidth = breakpoints[v]?.container?.maxWidth;
      if (v !== "default" && maxWidth) {
        value = isNeg ? `-${maxWidth}` : maxWidth;
      }
      if (value === "current") value = "currentColor";
      if (value.includes("calc")) value = value.replace(/([-+*/])/g, " $1 ");
    }

    const setMapping = (m, k) => {
      if (k) {
        factor = m[k].f || factor;
        value = m[k].v || value;
        template = m[k].t || template;
      }
    };
    setMapping(
      propMappings,
      Object.keys(propMappings).find((key) =>
        key.split("|").some((subKey) => prop.includes(subKey))
      )
    );
    setMapping(
      nameMappings,
      Object.keys(nameMappings).find((key) =>
        key.split("|").some((subKey) => name === subKey)
      )
    );

    if (parseFloat(factor) !== 0) {
      let factorNum = parseFloat(factor);
      if (factorNum !== factor) {
        let unit = factor.replace(factorNum.toString(), "");
        value = (parseFloat(value) * factorNum).toString() + unit;
      } else {
        value = (parseFloat(value) * factorNum).toString();
      }
    }

    if (template) {
      value = template.replace(/%d/, value);
    }
    return value;
  }

  /**
   * Processes variables within the utility value.
   * @param {string} prop - Property of the utility.
   * @param {string} value - Value of the utility.
   * @returns {string} - Processed value of the utility property with variables resolved.
   */
  processVariables(prop, value) {
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
