import UtilityProperties from "../utilities/utilityProperties.js";
import StaticUtilities from "../utilities/staticUtilities.js";

/**
 * Splitter class for splitting class names and determining properties.
 * @class
 */
export default class Splitter {
  /**
   * Initializes the Splitter instance.
   * @param {string} className - The class name to split.
   * @param {object} userUtilities - User-defined utilities.
   * @param {object} config - Mojo configuration.
   * @returns {object} - Object containing split class information.
   */
  constructor(className, userUtilities, config) {
    const prefix = config.options.prefix.trim();
    const isImportant = className.startsWith("!");
    className = isImportant ? className.slice(1) : className;
    className = className.slice(prefix.length)

    const classNameAppends = className.split("[");
    let appends;
    if (classNameAppends[1])
      appends = classNameAppends[1]
        .substring(0, classNameAppends[1].length - 1)
        .split(",");

    const classNameSplDirect = classNameAppends[0].split(":");
    const classNameSplDynamic = classNameSplDirect[0].split("-(");
    const classNameSpl = classNameSplDynamic[0].split("-");
    let isNegative = false;
    if (classNameSpl[0] === "" && classNameSpl[1] !== "") {
      classNameSpl.shift();
      isNegative = true;
    }

    const replaces = [
      [/\(/g, "\\("],
      [/\)/g, "\\)"],
      [/,/g, "\\,"],
      [/\./g, "\\."],
      [/#/g, "\\#"],
      [/\+/g, "\\+"],
      [/\*/g, "\\*"],
      [/:/g, "\\:"],
      [/%/g, "\\%"],
      [/\[/g, "\\["],
      [/]/g, "\\]"],
      [/\\_/g, "\\\\_"],
      [/\//g, "\\/"],
      [/\$/g, "\\$"],
    ];
    for (let i in replaces) {
      className = className.replace(replaces[i][0], replaces[i][1]);
    }

    let value = "",
      name = classNameSpl.join("-"),
      props = undefined,
      isForcedValue = false,
      isDirectUtility = false,
      body = undefined;

    if (
      classNameSplDirect[1] !== undefined &&
      !classNameSplDirect[1].startsWith("+") &&
      !classNameSplDirect[1].startsWith("-")
    ) {
      value = classNameSplDirect[1];
      props = classNameSplDirect[0];
      isForcedValue = true;
      isDirectUtility = true;
    } else if (classNameSplDynamic[1] !== undefined) {
      value = classNameSplDynamic[1].substring(0, classNameSplDynamic[1].length - 1);
      props = UtilityProperties[name];
      if (props === undefined && UtilityProperties["_"].includes(name)) {
        props = name;
      } else if (
        userUtilities[name] !== undefined &&
        userUtilities[name].isStatic === false
      ) {
        props = userUtilities[name].props;
      }
      isForcedValue = true;
    } else {
      while (classNameSpl.length > 0) {
        name = classNameSpl.join("-");
        if (UtilityProperties[name] !== undefined) {
          props = UtilityProperties[name];
          break;
        }
        if (UtilityProperties["_"].includes(name)) {
          props = name;
          break;
        }
        if (StaticUtilities[name] !== undefined) {
          body = StaticUtilities[name];
          break;
        }

        if (userUtilities[name] !== undefined) {
          let utl = userUtilities[name];
          if (utl.isStatic) body = utl.props;
          else props = utl.props;

          break;
        }

        if (value === "") value = classNameSpl.pop();
        else value = classNameSpl.pop() + "-" + value;
      }

      if(classNameSplDirect[1]){
        value += ":" + classNameSplDirect[1];
      }
    }

    if (name === "") {
      name = value;
    }

    if (!isDirectUtility && isNegative)
      value = value.startsWith("-") ? value.substring(1) : "-" + value;

    return {
      className: prefix + className,
      name,
      value,
      props,
      appends,
      body,
      isForcedValue,
      isDirectUtility,
      isImportant,
    };
  }
}
