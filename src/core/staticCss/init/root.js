import ColorConverter from "../../utils/colorConverter.js";

export default class Init {
  constructor(config, usedColors) {
    this.config = config;
    this.usedColors = usedColors;
  }

  getCss() {
    let CSS = "";
    const minify = this.config.options.minify;

    let N = "", S = "";
    if (minify === false) {
      N = "\n";
      S = " ";
    }

    for (let i in this.config.base.themes) {
      if (this.config.base.themes.hasOwnProperty(i)) {
        let isFirst = true;
        for (let j in this.usedColors) {
          if (this.usedColors.hasOwnProperty(j)) {
            if (i === "default" || (this.config.base.themes[i][j] !== undefined && this.config.base.themes.default[j] !== this.config.base.themes[i][j])) {
              if (isFirst) {
                if (i !== "default") {
                  CSS += `[m-theme="${i}"]${S}{${N}${S}${S}${S}${S}`;
                } else {
                  CSS += `:root${S}{${N}${S}${S}${S}${S}`;
                }
                isFirst = false;
              }


              for (let k of [...this.usedColors[j]]) {
                const cname = this.config.base.themes[i][j];
                if (k > 0) {
                  const lighten = this.config.base.lightenFn || ColorConverter.lighten
                  const color = lighten(cname, k * this.config.base.units.lighten);
                  CSS += getRootColorCSS(j + "-l-" + k, color);
                } else if (k < 0) {
                  const darken = this.config.base.darkenFn || ColorConverter.darken
                  const color = darken(cname, Math.abs(k) * this.config.base.units.darken);
                  CSS += getRootColorCSS(j + "-d" + k, color);
                } else {
                  const color = ColorConverter.parseColor(cname);
                  CSS += getRootColorCSS(j, color);
                }
              }

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

    function getRootColorCSS(name, color) {
      name = name.replace(/\./g, "-");
      return `--m-color-${name}: ${color[0]}, ${color[1]}, ${color[2]};${N}${S}${S}${S}${S}`;
    }

    return CSS;
  }
}
