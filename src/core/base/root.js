import { toHsl } from "../utilities/colorConverter.js";

/**
 * Generates CSS variables
 * @class
 */
export default class Root {
  /**
   * Initializes the Root instance.
   * @param {Object} config - The configuration object.
   * @param {Object} usedColors - The used colors object.
   */
  constructor(config, usedColors) {
    this.config = config;
    this.usedColors = usedColors;
  }

  /**
   * Generates CSS variables for color themes.
   * @returns {string} - The CSS variables string.
   */
  getCss() {
    let CSS = "";
    const minify = this.config.options.minify;
    const {themes} = this.config.base;

    let N = "", S = "";
    if (minify === false) {
      N = "\n";
      S = " ";
    }

    for (let i in themes) {
      if (themes.hasOwnProperty(i)) {
        let isFirst = true;
        for (let j of this.usedColors) {
            if (i === "default" || (themes[i][j] && themes.default[j] !== themes[i][j])) {
              if (isFirst) {
                CSS += `${i !== "default" ? `[m-theme="${i}"]` : `:root`}{${N}${S.repeat(4)}`;
                isFirst = false;
              }

              const cname = themes[i][j];
              const color = toHsl(cname);
              if(Array.isArray(color)) {
                CSS += getRootColorCSS(j, color);
              } else {
                console.warn(`Unable to convert color '${color}'.\nMake sure '${color}' is Hex or RGB(A)`)
              }
            }

        }
        if (!isFirst) {
          if (minify === false)
            CSS = CSS.substring(0, CSS.length - 4);
          CSS += `}${N}`;
        }
      }
    }

    /**
     * Generates CSS for a root color variable.
     * @param {string} name - The name of the color variable.
     * @param {array} color - The color value array.
     * @returns {string} - The CSS for the root color variable.
     */
    function getRootColorCSS(name, color) {
      name = name.replace(/\./g, "-");
      return `--m-color-${name}: ${color[0]}, ${color[1]}%;${N}${S.repeat(4)}--m-color-${name}-l: ${color[2]}%;${N}${S.repeat(4)}`;
    }

    return CSS;
  }
}

