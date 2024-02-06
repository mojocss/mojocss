import Init from './staticCss/init/init.js';
import Root from './staticCss/init/root.js';
import Fonts from './staticCss/init/fonts.js';
import Splitter from './builders/splitter.js';
import CssBuilder from './builders/css.js';
import StringBuilder from "./builders/string.js";
import BreakpointBuilder from "./builders/breakpoint.js";
import PatternBuilder from "./builders/pattern.js";
import Tiny from "./builders/tiny.js";

class MojoCore {
  init(args = {}) {
    this.args = args;

    if (this.args.isExtend === undefined)
      this.args.isExtend = false;

    if (this.args.theme === "default-theme")
      this.args.theme = "default";

    if (this.args.theme === "i-default-theme")
      this.args.theme = "i-default";

    if (this.args.tiny) {
      this.args.tiny = new Tiny().parseTiny(this.args.tiny);
    }

    return this;
  }

  setConfig(config) {
    this.config = config;
    this.initStyles = new Init(config).getCss();
    this.fontsStyles = new Fonts(config).getCss();

    if (this.usedColors === undefined) {
      this.usedColors = {};

      const defaultColors = ["body", "invert"];
      for (const color of defaultColors) {
        this.usedColors[color] = new Set();
        this.usedColors[color].add(0);
      }
    }

    if (this.userUtilities === undefined)
      this.userUtilities = {};


    return this;
  }

  addUtility(obj = {}) {
    let body = '';
    if (obj.body !== undefined) {
      body = obj.body;
      body = body.replace(/\\n/g, " ");
      body = body.replace(/\\t/g, " ");

      while (body.endsWith(" ")) {
        body = body.substring(0, body.length - 1);
      }
    }
    if (obj.pattern) {
      if (body.length > 0 && !body.endsWith(";"))
        body += ";"

      body += this.getPatternStyles(
        {
          0: obj.pattern
        }
      )
    }

    if (obj.name && obj.props)
      this.userUtilities[obj.name] = {
        props: obj.props,
        isStatic: false
      }
    if (obj.name && body !== '')
      this.userUtilities[obj.name] = {
        props: body,
        isStatic: true
      }
  }

  addPseudo(name, obj) {
    if (StringBuilder.pseudos[name] === undefined) {
      StringBuilder.pseudos[name] = obj;
    }
  }

  getInitStyles() {
    if (this.initStyles === undefined)
      return '';
    else
      return this.initStyles;
  }

  getRootStyles() {
    if (this.fontsStyles === undefined)
      this.fontsStyles = new Fonts(this.config).getCss();
    return this.fontsStyles + new Root(this.config, this.usedColors).getCss();
  }

  getPseudos() {
    return Object.keys(StringBuilder.pseudos);
  }

  getPatternStyles(patterns) {
    return new PatternBuilder({
      config: this.config,
      userUtilities: this.userUtilities,
      usedColors: this.usedColors,
      allPseudos: this.getPseudos(),
      patterns
    }).getStyles();
  }

  getStyles() {
    let CSS = "";
    const t1 = Date.now();

    const params = {
      config: this.config,
      isExtend: this.args.isExtend,
      pseudo: this.args.pseudo,
      theme: this.args.theme,
      children: this.args.children,
      breakpoint: this.args.breakpoint,
      usedColors: this.usedColors,
      attribute: this.args.attribute,
      tiny: this.args.tiny,
    }
    let body = [];

    if (!this.args.isExtend) {
      params.element = this.args.element;
    } else {
      params.selector = this.args.selector;
    }

    for (let c of this.args.classes) {
      params.splittedClass = new Splitter(c, this.userUtilities);

      if (!this.args.isExtend) {
        CSS += new CssBuilder(params).create();
      } else {
        if (params.splittedClass.body === undefined)
          params.splittedClass.body = this.args.body;

        body.push(new CssBuilder({...params, pseudo: undefined}).create());
      }
    }

    if(body.length > 0){
      body = body.join(";")

      CSS = new StringBuilder({
        pseudo: this.args.pseudo,
        className: this.args.selector,
        theme: this.args.theme,
        isExtend: this.args.isExtend,
        children: this.args.children,
        body: body.toString().replace(/;/g, ";\n    "),
      }).getCss();

      if (this.args.breakpoint !== undefined && this.config.options.minify === false)
        CSS = CSS.replace(/\n/g, "\n    ");
    }

    CSS = new BreakpointBuilder({
      ...this.args,
      config: this.config
    }).insertBreakpoint(CSS)

    const t2 = Date.now();
    return {
      css: CSS,
      time: t2 - t1
    };
  }
}

const core = new MojoCore();
export default core;

