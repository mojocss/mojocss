import { filter, transform } from "../utilities/defaults.js";
/**
 * Generates initial CSS styles.
 * @class
 */
export default class Init {
  /**
   * Initializes the Init instance.
   * @param {Object} config - The configuration object.
   */
  constructor(config) {
    this.config = config;
  }

  /**
   * Generates initial CSS styles.
   * @returns {string} - The initial CSS styles.
   */
  getCss() {
    let CSS = "";
    const { options, base } = this.config;
    const { minify, prefix } = options;
    let defaults = [
      ...filter.map(
        (prop) => `--m-f-${prop === "opacity" ? "drop-shadow" : prop}: ;`
      ),
      ...filter.map((prop) => `--m-bf-${prop}: ;`),
      ...transform.map(
        (prop) =>
          `--m-t-${prop
            .replace(/[A-Z]/g, "-$&")
            .replace("3d", "")
            .toLowerCase()}: ${prop.includes("scale") ? "1" : "0"};`
      ),
    ].join("");

    CSS += getCSS(
      "*, ::before, ::after",
      defaults.substring(0, defaults.length - 1)
    );
    if (options.initialStyles !== false) {
      CSS += getCSS(
        "*",
        "margin: 0;padding: 0;box-sizing: border-box;-webkit-tap-highlight-color: rgba(0, 0, 0, 0) !important"
      );
      CSS += getCSS("*,*::before,*::after", "border: 0 solid #00000000");
      CSS += getCSS("html", "font-size: 100%;-webkit-text-size-adjust: 100%");
      CSS += getCSS(
        "article, aside, figcaption, figure, footer, header, hgroup, main, nav, section ",
        "display: block"
      );
      let direction = options.rtl ? "rtl" : "ltr";
      CSS += getCSS(
        "body",
        "--m-bg-alpha: 1;--m-text-alpha: 1;background-color: hsla(var(--m-color-body),calc(var(--m-color-body-l) + var(--m-bg-lightness,0%)), var(--m-bg-alpha,1));color:  hsla(var(--m-color-invert),calc(var(--m-color-invert-l) + var(--m-text-lightness,0%)), var(--m-text-alpha,1));font-size: 1rem;font-weight: 400;line-height: 1.5;" +
          `direction: ${direction}`
      );

      let font = base.fonts[Object.keys(base.fonts)[0]];
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
      let directionAlign = options.rtl ? "right" : "left";
      CSS += getCSS(
        "td:not([align]), th:not([align])",
        "text-align: " + directionAlign
      );

      CSS += getCSS("html", `font-size: ${base.breakpoints.default.fontSize}`);
      CSS += getCSS(
        `.${prefix}container, .${prefix}container-fluid`,
        `width: 100%;margin: 0 auto;padding: ${base.breakpoints.default.container.padding}`
      );
      if (base.breakpoints.default.container?.maxWidth) {
        CSS += getCSS(
          `.${prefix}container`,
          `max-width: ${base.breakpoints.default.container.maxWidth}`
        );
      }

      const mediaStr = "@media only screen and";
      for (let bp in base.breakpoints) {
        if (!base.breakpoints.hasOwnProperty(bp) || bp === "default") continue;

        const bpo = base.breakpoints[bp];
        let b_min = bpo.min;
        let b_max = bpo.max;
        let c1 = "",
          c2 = "",
          c3 = "";

        if (bpo.container?.padding?.maxWidth) {
          c1 = `padding: ${bpo.container.padding};max-width: ${bpo.container.maxWidth}`;
          c2 = `padding: ${bpo.container.padding}`;
        } else if (bpo.container?.padding) {
          c1 = c2 = `padding: ${bpo.container.padding}`;
        } else if (bpo.container?.maxWidth) {
          c1 = `max-width: ${bpo.container.maxWidth}`;
        }
        if (bpo.fontSize) {
          c3 = `font-size: ${bpo.fontSize}`;
        }

        let body = "";
        if (c1 !== "") body += `.${prefix}container {${c1}}`;
        if (c2 !== "") body += `.${prefix}container-fluid {${c2}}`;
        if (c3 !== "") body += `html {${c3}}`;

        if (body !== "") {
          if (b_min && b_max && body !== "") {
            CSS += getContainerCSS(
              `${mediaStr} (min-width: ${b_min}) and (max-width:${b_max})`,
              body
            );
          }
          if (b_min && !b_max && body !== "") {
            CSS += getContainerCSS(`${mediaStr} (min-width: ${b_min})`, body);
          }
          if (!b_min && b_max && body !== "") {
            CSS += getContainerCSS(`${mediaStr} (max-width:${b_max})`, body);
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
