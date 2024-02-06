export default class Fonts {
  constructor(config) {
    this.config = config;
  }

  getCss() {
    let CSS = "";
    let N = "";
    const minify = this.config.options.minify;
    if (minify === false) {
      N = "\n";
    }

    for (let key in this.config.base.fonts) {
      if (this.config.base.fonts.hasOwnProperty(key)) {
        let font = this.config.base.fonts[key];
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
