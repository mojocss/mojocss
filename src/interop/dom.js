import Config from "./mojo.config.js";
import CssModule from "../core/index.js";
import CapsuleLoader from "../core/utils/capsuleLoader.js";
import Compile from "./dom/compile.js";
import MergeConfig from "./dom/mergeConfig.js";

let head,
  style,
  timeout,
  initialed = false,
  config = Config,
  cssModule,
  loadDisplay = "";

let currentCss = {
  init: "",
  utilities: "",
  patterns: "",
  capsule: "",
  transitions: "",
};

function addStyles(cssCode, append = true) {
  if (!append) {
    head.removeChild(style);
    style.textContent = "";
  }
  style.textContent += cssCode;

  if (!append) {
    head.appendChild(style);
  }

  if (cssCode.includes("-mojo-delay-")) {
    if (timeout !== undefined) clearTimeout(timeout);

    timeout = setTimeout(function () {
      style.textContent = style.textContent.replace(/-mojo-delay-/g, "");
    }, 30);
  }
}

function init() {
  if (!initialed) {
    head = document.head || document.getElementsByTagName("head")[0];
    style = document.createElement("style");
    style.setAttribute("type", "text/css");
    style.setAttribute("mojo-auto-generated", "");
    head.appendChild(style);

    const observeCallback = function (mutationsList) {
      let doCompile = false;
      for (const mutation of mutationsList) {
        if (mutation.type === "attributes") {
          const attributeName = mutation.attributeName;
          if (
            attributeName === "m-ignore" ||
            attributeName === "m-id"
          ) {
            continue;
          }
        }
        let isNotIgnored = true;
        let node = mutation.target;

        if(!node.hasAttribute("m-observe")) {
          if (node.hasAttribute("m-ignore") ||
            node.hasAttribute("mojo-auto-generated")) {
            isNotIgnored = false;
          }
          while (node !== null) {
            if (node.hasAttribute("m-ignore") &&
              node.getAttribute("m-ignore") === "children") {
              isNotIgnored = false;
              break;
            } else if (node.hasAttribute("m-observe") &&
              node.getAttribute("m-observe") === "children") {
              isNotIgnored = true;
              break;
            }

            node = node.parentElement;
          }
        }

        if (isNotIgnored) {
          doCompile = true;
        }
      }

      if (doCompile) {
        m();
      }
    };

    let observer = new MutationObserver(observeCallback);
    document.querySelectorAll("body").forEach(function (target) {
      observer.observe(target, {
        attributes: true,
        subtree: true,
        childList: true,
      });
    });

    const observe2Callback = function (mutationsList) {
      mutationsList.forEach((mutation, index) => {
        if (index === 0) {
          document.querySelectorAll("head style").forEach(function (target) {
            if (
              target.hasMutationObserver !== true &&
              !target.hasAttribute("mojo-auto-generated")
            ) {
              observer.observe(target, {
                attributes: true,
                subtree: true,
                childList: true,
              });
              target.hasMutationObserver = true;
            }
          });
        }
      });
    };

    let observer2 = new MutationObserver(observe2Callback);
    observer2.observe(document.head, {
      attributes: true,
      subtree: true,
      childList: false,
    });

    initialed = true;
  }
}

export default function m(cnf = undefined) {
  let first = false;
  if (!initialed) {
    first = true;
  }
  init();
  config = new MergeConfig(config, cnf);

  if (
    config.options.darkMode.enabled === true &&
    window !== undefined &&
    window.matchMedia !== undefined
  ) {
    let matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
    let targetNode = document.documentElement;
    if (matchMedia !== undefined) {
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

  cssModule = CssModule.init().setConfig(config);
  new CapsuleLoader({
    config,
    cssModule,
    append: function (css) {
      currentCss.capsule += css;
    },
    setConfig: function (c) {
      config = new MergeConfig(config, c);
    },
    addPatterns: function (p) {
      config.patterns = {...config.patterns, ...p};
    },
  });

  if (config.utilities !== undefined) {
    for (let i in config.utilities) {
      if (config.utilities.hasOwnProperty(i)) {
        cssModule.addUtility(config.utilities[i]);
      }
    }
  }

  let compile = new Compile(cssModule);

  function genKeyFramesObj(animObj) {
    return Object.entries(animObj).reduce((obj, [anName, an]) => {
      if (an.keyframes) {
        obj[`@keyframes m-${anName}`] = an.keyframes;
      }
      return obj;
    }, {});
  }

  const keyframesObject = genKeyFramesObj(config.base.definedValues.animation);
  config.patterns = {...config.patterns, ...keyframesObject};

  currentCss.patterns = cssModule.getPatternStyles(config.patterns);
  if (
    !first &&
    cnf !== undefined &&
    cnf.patterns !== undefined &&
    cnf.base === undefined &&
    cnf.extensions === undefined
  ) {
    setStyles(cssModule);
    return;
  }

  currentCss.init = cssModule.getInitStyles();

  let c = compile.compile();
  currentCss.utilities = c.css;
  currentCss.transitions = c.ts;
  setStyles(cssModule);

  document.querySelectorAll("[m-load]").forEach(function (el) {
    let t = el.getAttribute("m-load");
    if (!t || isNaN(parseInt(t))) t = 0;

    setTimeout(function () {
      el.style.display = loadDisplay;
      el.removeAttribute("m-load");
    }, t);
  });

}

function setStyles(cssModule) {
  addStyles(
    cssModule.getRootStyles() +
    currentCss.init +
    currentCss.patterns +
    currentCss.capsule +
    currentCss.utilities,
    false
  );
  if (currentCss.transitions.length > 0) {
    setTimeout(function () {
      addStyles(currentCss.transitions, true);
    }, 30);
  }
}

function docReady(fn) {
  if (!document) {
    setTimeout(function () {
      docReady(fn);
    }, 50);
    return;
  }

  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    setTimeout(fn, 50);
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

docReady(function () {
  if (!initialed && document) {
    document.querySelectorAll("[m-load]").forEach(function (el) {
      if(!el.style.display.includes("none")) {
        el.style.display = "none";
        loadDisplay = el.style.display;
      }
    })
  }
});
