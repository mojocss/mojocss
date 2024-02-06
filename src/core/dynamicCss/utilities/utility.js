import PropertyAppends from "../propertyAppends.js";

export default class Utility {
  constructor(args) {
    this.args = args;
    if (!Array.isArray(this.args.props)) {
      this.args.props = [this.args.props];
    }
  }

  toCss(prop, value, prepend = "", append = "") {
    let ret = `${prop}: ${value}`;

    if (prepend) {
      ret = `${prepend};${ret}`;
    }

    if (this.args.isForcedValue && PropertyAppends) {
      for (const key in PropertyAppends) {
        if (prop.includes(key)) {
          append += Object.entries(PropertyAppends[key])
            .map(([i, val]) => this.toCss(i, val))
            .join(';');
        }
      }
    }

    if (append) {
      ret = `${ret};${append}`;
    }

    return ret;
  }

}
