import UtilityProperties from "../dynamicCss/utilityProperties.js";
import StaticUtilities from "../dynamicCss/staticUtilities.js";

export default class Splitter {
  constructor(className, userUtilities) {
    const isImportant = className.startsWith("!");
    className = isImportant ? className.slice(1) : className;


    const classNameAppends = className.split("[");
    let appends;
    if (classNameAppends[1])
      appends = classNameAppends[1]
        .substring(0, classNameAppends[1].length - 1)
        .split(",");

    const classNameSplDirect = classNameAppends[0].split(":");
    const classNameSplDynamic = classNameAppends[0].split("-(");
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
      body = undefined;

    if (
      classNameSplDirect[1] !== undefined &&
      !classNameSplDirect[1].startsWith("+") &&
      !classNameSplDirect[1].startsWith("-")
    ) {
      value = "(" + classNameSplDirect[1] + ")";
      props = classNameSplDirect[0];
      isForcedValue = true;
    } else if (classNameSplDynamic[1] !== undefined) {
      value = "(" + classNameSplDynamic[1];
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
    }

    if (name === "") {
      name = value;
    }

    if (isNegative) value = "-" + value;

    return {
      className,
      name,
      value,
      props,
      appends,
      body,
      isForcedValue,
      isImportant,
    };
  }
}
