import Config from "./mojo.config.js";
import Core from "../core/index.js";
import CapsuleLoader from "./utils/capsuleLoader.js";
import Compile from "./utils/compile.js";
import MergeConfig from "./utils/mergeConfig.js";

/**
 * Interaction class between browser and the mojo core.
 * @class
 */
class MojoDOM{
  /**
   * Constructor for DOM class.
   * Initializes DOM object with default values and configuration.
   */
  constructor() {
    this.initialized = false;
    this.config = Config;
    this.core = Core.init();
    this.currentCSS = {
        init: "",
        utilities: "",
        patterns: "",
        capsule: "",
        transitions: "",
    };
  }
  
  /**
   * Add CSS styles to the document head.
   * @param {string} cssCode - CSS code to be added.
   * @param {boolean} isAppend - Flag to append or replace existing styles.
   */
  addStyles(cssCode, isAppend = true) {
    const style = this.style;
    if (!isAppend) {
      cssCode = "/*! Generated by Mojo CSS " + this.core.version + " | mojocss.com */\n" + cssCode;
      style.remove();
      style.textContent = cssCode;
      this.head.appendChild(this.style);
    } else {
      style.textContent += cssCode;
    }
    
    if (cssCode.indexOf("-mojo-d-") !== -1) {
      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        style.textContent = style.textContent.replace(/-mojo-d-/g, "");
      }, 30);
    }
  }
  
  /**
   * Add styles by this.currentCSS object.
   */
  setStyles() {
    const currentCSS = this.currentCSS
    this.addStyles(
      this.core.getRootStyles() +
      currentCSS.init +
      currentCSS.patterns +
      currentCSS.capsule +
      currentCSS.utilities +
      currentCSS.transitions,
      false
    );
  }
  
  /**
   * Initialize the elements and mutation observer.
   */
  init() {
    if (!this.initialized) {
      this.head = document.head || document.getElementsByTagName("head")[0];
      this.style = document.querySelector("style[mojo-auto-generated]") || document.createElement("style");
      this.style.setAttribute("type", "text/css");
      this.style.setAttribute("mojo-auto-generated", "");
      this.head.appendChild(this.style);

      const observeCallback = (mutationsList) => {
        let doCompile = false;
        for (const mutation of mutationsList) {
          if (mutation.type === "attributes") {
            const attributeName = mutation.attributeName;
            if (attributeName === "m-ignore" || attributeName === "m-id") {
              continue;
            }
          }

          let node = mutation.target;
          let isNotIgnored = mutation.attributeName !== "style";

          if (!node.hasAttribute("m-observe")) {
            if (node.hasAttribute("m-ignore") || node.hasAttribute("m-load") || node.hasAttribute("mojo-auto-generated")) {
              isNotIgnored = false;
            } else {
              while (node !== null) {
                if (node.hasAttribute("m-ignore") && node.getAttribute("m-ignore") === "children") {
                  isNotIgnored = false;
                  break;
                } else if (node.hasAttribute("m-observe") && node.getAttribute("m-observe") === "children") {
                  isNotIgnored = true;
                  break;
                }
                node = node.parentElement;
              }
            }
          } else {
            isNotIgnored = true;
          }
          
          if (isNotIgnored) {
            doCompile = true;
            break;
          }
        }
        
        if (doCompile) {
          this.render();
        }
      };
      
      let observer = new MutationObserver(observeCallback);
      document.querySelectorAll("body").forEach((target) => {
        observer.observe(target, {
          attributes: true,
          subtree: true,
          childList: true,
        });
      });
      
      this.initialized = true;
    }
  }
  
  /**
   * Render to create CSS from HTML and configuration.
   * @param {Object} cnf - Optional configuration object.
   */
  render(cnf = undefined) {
    let first = !this.initialized;
    this.init();
    let config = this.config = new MergeConfig(this.config, cnf);
    
    if (config.options.darkMode.enabled && window && window.matchMedia) {
      let matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
      let targetNode = document.documentElement;
      if (matchMedia) {
        if (matchMedia.matches) {
          targetNode.setAttribute("m-theme", config.options.darkMode.theme);
        }
        
        matchMedia.addEventListener("change", (e) => {
          if (e.matches) {
            targetNode.setAttribute("m-theme", config.options.darkMode.theme);
          } else {
            targetNode.removeAttribute("m-theme");
          }
        });
      }
    }
    
    this.core = Core.setConfig(config);
    new CapsuleLoader({
      config: config,
      core: this.core,
      append: (css) => {
        this.currentCSS.capsule += css;
      },
      setConfig: (c) => {
        config = new MergeConfig(config, c);
      },
      addPatterns: (p) => {
        config.patterns = {...config.patterns, ...p};
      },
    });
    
    if (config.utilities !== undefined) {
      for (let i in config.utilities) {
        if (config.utilities.hasOwnProperty(i)) {
          this.core.addUtility(config.utilities[i]);
        }
      }
    }
    
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
  
    this.currentCSS.patterns = this.core.getPatternStyles(config.patterns);
    if (
      !first &&
      cnf !== undefined &&
      cnf.patterns !== undefined &&
      cnf.base === undefined &&
      cnf.extensions === undefined
    ) {
      this.setStyles();
      return;
    }
  
    this.currentCSS.init = this.core.getInitStyles();
    
    let compile = new Compile(document, this.core);
    
    let c = compile.compile();
    this.currentCSS.utilities = c.utilities;
    this.currentCSS.transitions = c.transitions;
    this.setStyles();
    
    document.querySelectorAll("[m-load]").forEach((el) => {
      let t = el.getAttribute("m-load");
      if (!t || isNaN(parseInt(t))) t = 0;
      
      setTimeout(() => {
        el.style.display = "";
        el.removeAttribute("m-load");
      }, t);
    });

    if(!window.mojo)
      window.mojo = (c) => this.render(c);
  }
}

const mojoDOM = new MojoDOM();
export default mojoDOM;