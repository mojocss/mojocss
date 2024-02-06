export default class Init {
  constructor(config) {
    this.config = config;
  }

  getCss() {
    let CSS = "";

    const minify = this.config.options.minify;

    CSS += getCSS(
      "*, ::before, ::after",
      "--m-f-blur: ;--m-f-brightness: ;--m-f-contrast: ;--m-f-grayscale: ;--m-f-hue-rotate: ;--m-f-invert: ;--m-f-saturate: ;--m-f-sepia: ;--m-f-drop-shadow: ;--m-bf-blur: ;--m-bf-brightness: ;--m-bf-contrast: ;--m-bf-grayscale: ;--m-bf-hue-rotate: ;--m-bf-invert: ;--m-bf-saturate: ;--m-bf-sepia: ;--m-bf-drop-shadow: ;--m-bf-opacity: ;--m-t-translate-x: 0;--m-t-translate-y: 0;--m-t-translate-z: 0;--m-t-rotate: 0;--m-t-rotate-x: 0;--m-t-rotate-y: 0;--m-t-rotate-z: 0;--m-t-skew-x: 0;--m-t-skew-y: 0;--m-t-scale: 1;--m-t-scale-x: 1;--m-t-scale-y: 1;--m-t-scale-z: 1"
    );
    if (this.config.options.initialStyles !== false) {
      CSS += getCSS(
        "*",
        "margin: 0;padding: 0;box-sizing: border-box;-webkit-tap-highlight-color: rgba(0, 0, 0, 0) !important"
      );
      CSS += getCSS("*,*::before,*::after", "border: 0 solid #00000000;");
      CSS += getCSS("html", "font-size: 100%;-webkit-text-size-adjust: 100%");
      CSS += getCSS(
        "article, aside, figcaption, figure, footer, header, hgroup, main, nav, section ",
        "display: block"
      );
      let direction = this.config.options.rtl ? "rtl" : "ltr";
      CSS += getCSS(
        "body",
        "--m-bg-alpha: 1;--m-text-alpha: 1;background-color: rgba(var(--m-color-body), var(--m-bg-alpha));color: rgba(var(--m-color-invert), var(--m-text-alpha));font-size: 1rem;font-weight: 400;line-height: 1.5;" +
          `direction: ${direction}`
      );

      let font = this.config.base.fonts[Object.keys(this.config.base.fonts)[0]];
      let fontName;
      if (typeof font === typeof "") {
        fontName = font;
      } else {
        if (Array.isArray(font)) fontName = font.join(", ");
        else {
          fontName = Object.keys(font).join(", ");
        }
      }

      CSS += getCSS(
        "body, button, input, select, textarea",
        `font-family: ${fontName}`
      );
      CSS += getCSS(
        "button,input,optgroup,select,textarea",
        "font-family: inherit;font-size: 100%;line-height: 1.15;margin: 0"
      );
      CSS += getCSS("a", "text-decoration: none");
      CSS += getCSS("p", "margin: 0.4rem 0");
      CSS += getCSS(
        "h1,h2,h3,h4,h5,h6",
        "margin-top: 0;margin-bottom: 0.5rem;display: block;font-weight: 500"
      );
      CSS += getCSS("h1", "font-size: 2rem");
      CSS += getCSS("h2", "font-size: 1.5rem");
      CSS += getCSS("h3", "font-size: 1.25rem");
      CSS += getCSS("h4", "font-size: 1rem");
      CSS += getCSS("h5", "font-size: .83rem");
      CSS += getCSS("h6", "font-size: .67rem");
      CSS += getCSS("i", "vertical-align: middle !important;user-select: none");
      CSS += getCSS("button, input, select, textarea", "margin: 0");
      CSS += getCSS("iframe", "margin: 0");
      CSS += getCSS("table", "border-collapse: collapse;border-spacing: 0");
      CSS += getCSS("td, th", "padding: 0");
      let directionAlign = this.config.options.rtl ? "right" : "left";
      CSS += getCSS(
        "td:not([align]), th:not([align])",
        "text-align: " + directionAlign
      );

      CSS += getCSS(
        "html",
        `font-size: ${this.config.base.breakpoints.default.fontSize}`
      );
      CSS += getCSS(
        ".container, .container-fluid",
        `width: 100%;margin: 0 auto;padding: ${this.config.base.breakpoints.default.container.padding}`
      );
      if (
        this.config.base.breakpoints.default.container !== undefined &&
        this.config.base.breakpoints.default.container.maxWidth !== undefined
      ) {
        CSS += getCSS(
          ".container",
          `max-width: ${this.config.base.breakpoints.default.container.maxWidth}`
        );
      }
      for (let bp in this.config.base.breakpoints) {
        if (!this.config.base.breakpoints.hasOwnProperty(bp) || bp === "default") continue;

        const bpo = this.config.base.breakpoints[bp];
        let b_min = bpo.min;
        let b_max = bpo.max;
        let c1 = "",
          c2 = "",
          c3 = "";

        if (
          bpo.container !== undefined &&
          bpo.container.padding !== undefined &&
          bpo.container.maxWidth !== undefined
        ) {
          c1 = `padding: ${bpo.container.padding};max-width: ${bpo.container.maxWidth}`;
          c2 = `padding: ${bpo.container.padding}`;
        } else if (
          bpo.container !== undefined &&
          bpo.container.padding !== undefined
        ) {
          c1 = c2 = `padding: ${bpo.container.padding}`;
        } else if (
          bpo.container !== undefined &&
          bpo.container.maxWidth !== undefined
        ) {
          c1 = `max-width: ${bpo.container.maxWidth}`;
        }
        if (bpo.fontSize !== undefined) {
          c3 = `font-size: ${bpo.fontSize}`;
        }

        let body = "";
        if (c1 !== "") body += `.container {${c1}}`;
        if (c2 !== "") body += `.container-fluid {${c2}}`;
        if (c3 !== "") body += `html {${c3}}`;

        if (body !== "") {
          if (b_min !== undefined && b_max !== undefined && body !== "") {
            CSS += getContainerCSS(
              `@media only screen and (min-width: ${b_min}) and (max-width:${b_max})`,
              body
            );
          }
          if (b_min !== undefined && b_max === undefined && body !== "") {
            CSS += getContainerCSS(
              `@media only screen and (min-width: ${b_min})`,
              body
            );
          }
          if (b_min === undefined && b_max !== undefined && body !== "") {
            CSS += getContainerCSS(
              `@media only screen and (max-width:${b_max})`,
              body
            );
          }
        }
      }

    }

    function getContainerCSS(name, body) {
      if (minify === false)
        return `${name} {\n    ${body
          .replace(/;/g, ";\n        ")
          .replace(/{/g, "{\n        ")
          .replace(/}/g, "\n    }\n    ")}\n}\n`.replace(/\n {4}\n/g, "\n");

      return `${name}{${body}}`;
    }

    function getCSS(name, body) {
      if (minify === false)
        return `${name} {\n    ${body.replace(/;/g, ";\n    ")};\n}\n`;

      return `${name}{${body}}`;
    }

    return CSS;
  }
}
