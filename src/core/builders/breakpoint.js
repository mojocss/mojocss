/**
 * BreakpointBuilder class for create breakpoints in CSS.
 * @class
 */
export default class BreakpointBuilder {
  /**
   * Initializes the BreakpointBuilder instance.
   * @param {object} args - Arguments object.
   */
  constructor(args) {
    this.args = args;
  }

  /**
   * Inserts breakpoints into CSS.
   * @param {string} CSS - The CSS string.
   * @returns {string} - The CSS string with breakpoints inserted.
   */
  insertBreakpoint(CSS) {
    if(!CSS.trim())
      return CSS;

    const {config, allPseudos} = this.args;
    let {pseudo} = this.args;
    let bpName = this.args.breakpoint;
    let invert = false;

    const media = [];
    if(pseudo)
    for (let p of pseudo){
      if(allPseudos[p] && allPseudos[p].media){
        media.push(allPseudos[p].media);
      }
    }

    if ((bpName !== undefined && CSS.length > 0 ) || media.length > 0 || (this.args.tiny && this.args.tiny.parent && this.args.tiny.parent.startsWith("@media") )) {
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
        bp = { ...config.base.breakpoints[bpName] };

      if (invert) {
        const min = bp.min;
        bp.min = bp.max;
        bp.max = min;
      }

      bp.media = media;

      if (parseInt(bp.max) < parseInt(bp.min)) {
        CSS = this.getBpCss({min: bp.min}, this.args.pseudo, CSS) + ((parseInt(bp.max) > 0) ? this.getBpCss({max: bp.max}, this.args.pseudo, CSS) : "");
      } else {
        CSS = this.getBpCss(bp, this.args.pseudo, CSS);
      }

    }

    return CSS;
  }

  /**
   * Generates CSS with breakpoints.
   * @param {object} bp - The breakpoint object.
   * @param {string} pseudo - The pseudo selector.
   * @param {string} css - The CSS string.
   * @returns {string} - The CSS string with breakpoints applied.
   */
  getBpCss(bp, pseudo, css) {
    /**
     * Generates media query CSS.
     * @param {string} name - The name of the media query (min or max).
     * @param {string} value - The value of the media query.
     * @returns {string} - The generated media query string.
     */
    const getQuery = (name, value) => {
      let v = parseFloat(value);
      let suf = value.replace(v, "");
      return `(${name}-width: ${name === "max" ? v - 0.02 : v}${suf}) `;
    }

    if(bp.media.length < 1){
      bp.media = ["only screen"];
    }

    let bpCss = `@media ${bp.media.join(" and ")}${bp.min ? " and " + getQuery('min', bp.min) : ""}${bp.max ? " and " + getQuery('max', bp.max) : ""}`;

    if(this.args.tiny && this.args.tiny.parent.startsWith("@media"))
      bpCss += `${this.args.tiny ? " and " + this.args.tiny.parent.replace("@media","") : ""}`;


    if (this.args.config.options.minify === false)
      return bpCss + "{\n    " + css.slice(0, -4) + "}\n"

    return bpCss + "{" + css + "}"
  }
}

