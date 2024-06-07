/**
 * Generate CSS for importing fonts.
 */
export default class Fonts {
  /**
   * Initializes the Fonts instance.
   * @param {Object} config - The configuration object.
   */
  constructor(config) {
    this.config = config;
  }

  /**
   * Generates CSS for importing fonts.
   * @returns {string} - The CSS for importing fonts.
   */
  getCss() {
    const {config} = this
    let CSS = "";
    let N = "";
    const minify = config.options.minify;
    if (minify === false) {
      N = "\n";
    }

    for (let key in config.base.fonts) {
      if (config.base.fonts.hasOwnProperty(key)) {
        let font = config.base.fonts[key];
        if (typeof font !== typeof "" && !Array.isArray(font)) {
          for (let i in font) {
            if (font.hasOwnProperty(i)) {
              if (font[i].length > 0) {
                CSS += `@import url("${font[i]}");\n${N}`
              }
            }
          }
        }
      }
    }

    return CSS;
  }
}
