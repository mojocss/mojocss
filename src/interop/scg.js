import {JSDOM} from "jsdom"
import Config from "./mojo.config.js";
import MergeConfig from "./utils/mergeConfig.js";
import Core from "../core/index.js";
import Compile from "./utils/compile.js";
import CapsuleLoader from "./utils/capsuleLoader.js";

/**
 * Generates CSS from HTML in Node.js side
 * @class
 */
class MojoSCG {
  /**
   * Constructor.
   * @param {string} html - The HTML string.
   * @param {Object} config - Mojo configuration.
   */
  constructor(html, config = {}) {
    const { window } = new JSDOM(html);
    this.document = window.document;
    this.config = new MergeConfig(Config, config);
    this.core = Core.init().setConfig(this.config);
  }

  /**
   * Render HTML to generate CSS.
   * @returns {string} The generated CSS.
   */
  render() {
    let config = this.config;
    let capsulesCSS = "";

    // Load capsules
    new CapsuleLoader({
      config: config,
      core: this.core,
      append: (css) => {
        capsulesCSS += css;
      },
      setConfig: (c) => {
        config = new MergeConfig(config, c);
      },
      addPatterns: (p) => {
        config.patterns = {...config.patterns, ...p};
      },
    });

    // Add user utilities
    if (config.utilities) {
      for (let i in config.utilities) {
        if (config.utilities.hasOwnProperty(i)) {
          this.core.addUtility(config.utilities[i]);
        }
      }
    }

    // Add animations
    const genKeyFramesObj = (animObj) => {
      return Object.entries(animObj).reduce((obj, [anName, an]) => {
        if (an.keyframes) {
          obj[`@keyframes m-${anName}`] = an.keyframes;
        }
        return obj;
      }, {});
    }
    const keyframesObject = genKeyFramesObj(config.base.definedValues.animation);
    config.patterns = {...config.patterns, ...keyframesObject};
  
    let compile = new Compile(this.document, this.core);
  
    let c = compile.compile();
    
    return "/*! Generated by Mojo CSS " + this.core.version + " | mojocss.com */\n" + (this.core.getRootStyles() +
      this.core.getInitStyles() +
      this.core.getPatternStyles(config.patterns) +
      capsulesCSS +
      c.utilities +
      c.transitions).replace(/-mojo-d-/g, "");
  }

}
export default MojoSCG