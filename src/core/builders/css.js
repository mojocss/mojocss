import StringBuilder from "./string.js";
import UtilityOptions from "../utils/utilityOptions.js";
import DynamicCss from "../dynamicCss/dynamicCss.js";

export default class CssBuilder {
  constructor(args) {
    this.args = args;

    this.utilityPseudo = '';
  }

  create() {
    let className = this.args.splittedClass.className;
    let name = this.args.splittedClass.name;
    let props = this.args.splittedClass.props;


    let body = undefined;
    if (this.args.splittedClass.body !== undefined) {
      body = this.args.splittedClass.body;
    } else if (props !== undefined) {
      body = new DynamicCss({
        ...this.args.splittedClass,
        config: this.args.config,
        usedColors: this.args.usedColors,
      }).getCss();
    }

    let css = "";
    if (body !== undefined) {
      if (this.args.splittedClass.isImportant) {
        className = "\\!" + className;
        body = body.split(";").map(prop => `${prop} !important`).join(";");
      }

      if (UtilityOptions[name] !== undefined && UtilityOptions[name].pseudo !== undefined) {
        this.utilityPseudo = UtilityOptions[name].pseudo;
      }

      const minify = this.args.config.options.minify;
      if (!this.args.justBody) {
        body = body.toString();
        if (minify === false)
          body = body.toString().replace(/;/g, ";\n    ");

        css = new StringBuilder({
          pseudo: this.args.pseudo,
          className,
          theme: this.args.theme,
          isExtend: this.args.isExtend,
          selector: this.args.selector,
          children: this.args.children,
          attribute: this.args.attribute,
          tiny: this.args.tiny,
          utilityPseudo: this.utilityPseudo,
          element: this.args.element,
          minify,
          body
        }).getCss();

        if (body.length === 0 && this.args.ignoreBodyRemove !== true) {
          css = css.replace(/[\n\r\t{}]/g, "");
        } else if (body.length === 0) {
          css = "";
        }

      } else css = body;


      if (css !== undefined && (this.args.breakpoint !== undefined || this.args.tiny !== undefined) && minify === false)
        css = css.replace(/\n/g, "\n    ");
    }

    return css;
  }

}
