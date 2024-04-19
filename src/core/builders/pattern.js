import CssBuilder from "./css.js";
import Splitter from "./splitter.js";
import BreakpointBuilder from "./breakpoint.js";


/**
 * PatternBuilder class converts a pattern object into CSS styles.
 * @class
 */
export default class PatternBuilder {
  /**
   * Initializes a new instance of the PatternBuilder class.
   * @param {Object} args - Arguments for pattern conversion.
   */
  constructor(args) {
    this.args = args;
    this.bps = {}; // Object to store CSS styles for different breakpoints
    this.stack = []; // Stack to keep track of nested selectors
  }

  /**
   * Converts a pattern object into CSS styles.
   * @param {Object} currentNode - Current node of the pattern object.
   * @returns {string} - CSS styles generated from the pattern.
   */
  patternToCSS(currentNode) {
    let CSS = "";
    const {config, userUtilities, usedColors, allPseudos} = this.args;
    const length = Object.keys(currentNode).length;
    let count = 0;

    for (let i in currentNode) {
      count++;
      if (currentNode.hasOwnProperty(i)) {
        let currentCSS = "", args = {}, atSelector = false;

        let selector = fixString(i);
        if (selector.startsWith("@")) {
          atSelector = true;
          if (config.options.minify === false)
            currentCSS += selector + " {\n";
          else
            currentCSS += selector + "{";
        } else {
          this.stack.push(getVariantStatus(i));
        }

        if (typeof currentNode[i] !== "string" && fixString(i) !== "style" && !Array.isArray(currentNode[i])) {
          currentCSS += this.patternToCSS(currentNode[i])
        } else {
          let selectors = [];

          for (let s = 0; s < this.stack.length; s++) {
            if (this.stack[s].breakpoint)
              args.breakpoint = this.stack[s].breakpoint;
            if (this.stack[s].theme)
              args.theme = this.stack[s].theme;

            if (this.stack[s].names.length < 1 && this.stack[s + 1] !== undefined)
              continue;

            let obj = {
              names: this.stack[s].names,
              pseudo: [],
              selectors: []
            };

            if (this.stack[s].pseudo) {
              if (Array.isArray(this.stack[s].pseudo))
                obj.pseudo = this.stack[s].pseudo;
              else
                obj.pseudo.push(this.stack[s].pseudo);
            }

            for (let j = s + 1; j < this.stack.length; j++) {
              if (this.stack[j].names.length > 0)
                break;

              if (this.stack[j].pseudo) {
                obj.pseudo = [...obj.pseudo, ...this.stack[j].pseudo];
              }
            }

            if (obj.names.length === 0 && args.theme !== undefined) {
              obj.names.push("")
            }

            for (let j of obj.names) {
              if(j.trim().length > 0) {
                let Selector = CSSByBody({
                  selector: j,
                  body: "",
                  pseudo: obj.pseudo,
                })
                obj.selectors.push(fixString(Selector))
              }
            }

            selectors.push(obj.selectors)
          }

          let value = currentNode[i];
          if (typeof value === typeof {}) {
            value = "";
            for (let prop in currentNode[i]) {
              if (currentNode[i].hasOwnProperty(prop)) {
                value += `${prop.replace(/[A-Z]/g, (match, offset) => (offset > 0 ? '-' : '') + match.toLowerCase())}: ${currentNode[i][prop]};`
              }
            }
          }

          selectors = getSelectors(selectors);
          if (selectors.length < 1 && (args.theme !== undefined || args.breakpoint !== undefined)) {
            selectors = [""]
          }

          for (let selector of selectors) {
            let justBody = false
            if (selector === "0")
              justBody = true;

            if (typeof value === 'string') {
              if (value.includes(";")) {
                currentCSS += CSSByBody({
                  selector: selector.trim(),
                  justBody,
                  ignoreBodyRemove: true,
                  body: value,
                  ...args,
                })
              } else {
                currentCSS += CSSByUtilities({
                  selector: selector.trim(),
                  classes: value,
                  justBody,
                  ignoreBodyRemove: true,
                  ...args,
                })
              }
            } else if (Array.isArray(value)) {
              currentCSS += CSSByUtilities({
                selector: selector.trim(),
                classes: value,
                justBody,
                ignoreBodyRemove: true,
                ...args
              })
            }

          }
        }

        if (atSelector) {
          if (config.options.minify === false) {
            currentCSS = currentCSS.replace(/\n/g, "\n    ");
            currentCSS += "\n}\n";
            currentCSS = currentCSS.replace(/\n{4}\n/g, "\n");
          } else {
            currentCSS += "}";
          }
        }

        if (args.breakpoint !== undefined) {
          if (this.bps[args.breakpoint] === undefined)
            this.bps[args.breakpoint] = [];

          this.bps[args.breakpoint].push(currentCSS)
        } else {
          CSS += currentCSS;
        }

        if(count >= length || !atSelector)
          this.stack.pop();
      }
    }

    return CSS;

    /**
     * Generates selectors for nested combinations of names and pseudos.
     * @param {Array} arr - Array of nested selectors.
     * @param {number} index - Current index in the array.
     * @param {Array} parents - Array of parent selectors.
     * @returns {Array} - Array of generated selectors.
     */
    function getSelectors(arr, index = 0, parents = [""]) {
      let newParents = [];
      for (let c of arr[index]) {
        let S = " ";
        c = c.trim();
        if (c.startsWith("&")) {
          c = c.substring(1);
          S = "";
        }
        for (let p of parents) {
          p = p.trim();
          newParents.push(p + ((p !== "") ? S : "") + c)
        }
      }
      let ret = newParents;

      if (arr[index + 1] !== undefined) {
        const keys = Object.keys(arr[index + 1]);
        for (let j = 0; j < keys.length; j++) {
          ret = getSelectors(arr, index + 1, newParents);
        }
      }

      return ret;
    }

    function getVariantStatus(name) {
      let ret = {
        names: [],
        pseudo: [],
      };
      let n = fixString(name);
      let cSplit = n.split(",");
      let isSelector = false;
      for (let j of cSplit) {
        let n = fixString(j);
        let dSplit = n.split(":");
        for (let k of dSplit) {
          let n = fixString(k);
          if (n === 'idle')
            continue;

          let type = findAttributeType(n);
          switch (type) {
            case 0:
              ret.theme = n;
              break;
            case 1:
              ret.breakpoint = n;
              break;
            case 2:
              if (!isSelector)
                ret.pseudo.push(n);
              break;
            case -1:
              if (n !== "style")
                ret.names.push(n);
              isSelector = true;
          }
        }


        if (isSelector) {
          if (dSplit.length > 1) {
            for (let k of dSplit) {
              let n = fixString(k);
              const index = ret.names.indexOf(n);
              if (index !== -1) {
                ret.names.splice(index, 1);
              }
            }
            ret.names.push(n)
          }
        }
      }

      return ret;
    }

    function fixString(str) {
      return str.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');
    }

    /**
     * Determines the type of an attribute (theme, breakpoint, or pseudo-class).
     * @param {string} attribute - The attribute to be checked.
     * @returns {number} - Type of the attribute.
     */
    function findAttributeType(attribute) {
      if (attribute.startsWith("i-")) attribute = attribute.substring(2);

      if (attribute === "default-theme") attribute = "default";
      if (attribute === "idle") return 2;

      if (config.base.themes[attribute] !== undefined) return 0;
      if (config.base.breakpoints[attribute] !== undefined) return 1;
      if (allPseudos.includes(attribute)) return 2;

      return -1;
    }

    /**
     * Generates CSS styles for a selector with provided body.
     * @param {Object} args - Arguments for CSS generation.
     * @returns {string} - CSS styles for the selector.
     */
    function CSSByBody(args) {
      if (!args.pseudo || args.pseudo.length === 0)
        args.pseudo = ["class"];

      const splittedClass = {
        className: args.selector,
        body: args.body
      };
      return new CssBuilder({
        splittedClass,
        config,
        isExtend: true,
        attribute: "",
        ...args
      }).create();
    }

    /**
     * Generates CSS styles for utility classes applied to a selector.
     * @param {Object} args - Arguments for CSS generation.
     * @returns {string} - CSS styles for the selector.
     */
    function CSSByUtilities(args) {
      let classes;
      if (Array.isArray(args.classes)) {
        classes = args.classes;
      } else {
        args.classes = args.classes.replace(/\n|\s{2,}/g, " ");
        classes = args.classes.split(" ");
      }

      const placeholders = [];
      const body = [];

      let css = [];
      for (let c of classes) {
        if (c.replace(/ /g, "") < 1)
          continue;

        const splittedClass = new Splitter(c, userUtilities, config);
        let currentBody = new CssBuilder({
          splittedClass,
          config,
          usedColors,
          attribute: "",
          isExtend: true,
          ...args,
          justBody: true,
        }).create();

        if(c.replace("!","").trim().startsWith("placeholder")){
          placeholders.push(currentBody)
        } else {
          body.push(currentBody)
        }
      }
      args.body = body.join(";");
      let styles = CSSByBody(args);
      if(styles.trim().length > 0)
        css.push(styles);

      args.body = placeholders.join(";");
      args.selector += "::placeholder";
      styles = CSSByBody(args);
      if(styles.trim().length > 0)
        css.push(styles);

      return css.join("\n");
    }
  }

  /**
   * Generates CSS styles from the pattern object and inserts breakpoints if needed.
   * @returns {string} - CSS styles including breakpoints.
   */
  getStyles() {
    let s = this.patternToCSS(this.args.patterns);
    
    let breakpoints = Object.keys(this.args.config.base.breakpoints);
    let reverseBreakpoints = breakpoints.filter(breakpoint => breakpoint !== "default").map(breakpoint => "i-" + breakpoint).reverse();
    let bps = [...breakpoints, ...reverseBreakpoints];

    for (let i of bps) {
      if (this.bps[i] === undefined)
        continue;

      let css = this.bps[i].join("");


      s += new BreakpointBuilder({
        breakpoint: i,
        config: this.args.config
      }).insertBreakpoint(css)
    }

    return s;
  }
}
