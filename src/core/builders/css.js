import StringBuilder from "./string.js";
import UtilityOptions from "../utilities/utilityOptions.js";
import DynamicCss from "../utilities/dynamicCss.js";

/**
 * CssBuilder class.
 * @class
 */
export default class CssBuilder {
  /**
   * Initializes the CssBuilder instance.
   * @param {object} args - Arguments object.
   */
  constructor(args) {
    this.args = args;

    this.utilityPseudo = '';
  }

  /**
   * Creates CSS based on the provided arguments.
   * @returns {string} - The generated CSS string.
   */
  create() {
    const args = this.args
    let className = args.splittedClass.className;
    let name = args.splittedClass.name;
    let props = args.splittedClass.props;


    let body = undefined;
    if (args.splittedClass.body !== undefined) {
      body = args.splittedClass.body;
    } else if (props !== undefined) {
      body = new DynamicCss({
        ...args.splittedClass,
        config: args.config,
        usedColors: args.usedColors,
      }).getCss();
    }

    let css = "";
    if (body !== undefined) {
      if (args.splittedClass.isImportant) {
        className = "\\!" + className;
        body = body.split(";").map(prop => `${prop} !important`).join(";");
      }

      if (UtilityOptions[name]?.pseudo) {
        this.utilityPseudo = UtilityOptions[name].pseudo;
      }

      const minify = args.config.options.minify;
      if (!args.justBody) {
        body = body.toString();
        if (minify === false)
          body = body.toString().replace(/;/g, ";\n    ");

        css = new StringBuilder({
          pseudo: args.pseudo,
          className,
          theme: args.theme,
          isExtend: args.isExtend,
          selector: args.selector,
          attribute: args.attribute,
          tiny: args.tiny,
          utilityPseudo: this.utilityPseudo,
          element: args.element,
          minify,
          body
        }).getCss();

        if (body.length === 0 && args.ignoreBodyRemove !== true) {
          css = css.replace(/[\n\r\t{}]/g, "");
        } else if (body.length === 0) {
          css = "";
        }

      } else css = body;

      if (css !== undefined && (args.breakpoint !== undefined || (args.tiny && args.tiny.parent.startsWith("@"))) && minify === false)
        css = css.replace(/\n/g, "\n    ");
    }

    return css;
  }

}
