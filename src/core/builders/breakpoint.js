export default class BreakpointBuilder {
  constructor(args) {
    this.args = args;
  }

  insertBreakpoint(CSS) {
    const config = this.args.config;
    let bpName = this.args.breakpoint;
    let invert = false;

    if ((bpName !== undefined && CSS.length > 0 ) || (this.args.tiny && this.args.tiny.parent && this.args.tiny.parent.startsWith("@media") )) {
      if(!bpName)
        bpName = "-1";

      if (bpName.startsWith("i-")) {
        bpName = bpName.substring(2);
        invert = true;
      }
      if (bpName === "default")
        return CSS;

      let bp = {
        min: undefined,
        max: undefined
      }
      if(config.base.breakpoints[bpName])
        bp = Object.create(config.base.breakpoints[bpName]);

      if (invert) {
        const min = bp.min;
        bp.min = bp.max;
        bp.max = min;
      }

      if (parseInt(bp.max) < parseInt(bp.min)) {
        CSS = this.getBpCss({min: bp.min}, this.args.pseudo, CSS) + ((parseInt(bp.max) > 0) ? this.getBpCss({max: bp.max}, this.args.pseudo, CSS) : "");
      } else {
        CSS = this.getBpCss(bp, this.args.pseudo, CSS);
      }

    }

    return CSS;
  }

  getBpCss(bp, pseudo, css) {
    function getQuery(name, value) {
      let v = parseFloat(value);
      let suf = value.replace(v, "");
      return `(${name}-width: ${name === "max" ? v - 0.02 : v}${suf}) `;
    }

    let bpCss = `@media ${pseudo !== "print" ? "only screen " : ""}${bp.min ? "and " + getQuery('min', bp.min) : ""}${bp.max ? "and " + getQuery('max', bp.max) : ""}`;

    if(this.args.tiny && this.args.tiny.parent.startsWith("@media"))
      bpCss += `${this.args.tiny ? "and " + this.args.tiny.parent.replace("@media","") : ""}`;


    if (this.args.config.options.minify === false)
      return bpCss + "{\n    " + css.slice(0, -4) + "}\n"

    return bpCss + "{" + css + "}"
  }
}

