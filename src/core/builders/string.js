/**
 * StringBuilder class for building CSS strings.
 * @class
 */
export default class StringBuilder {
  /**
   * Initializes the StringBuilder instance.
   * @param {object} args - Arguments object.
   */
  constructor(args) {
    this.args = args;
  }

  /**
   * Generates the CSS string based on the provided arguments.
   * @returns {string} - The generated CSS string.
   */
  getCss() {
    const _ = this;
    const args = this.args;
    if (args.utilityPseudo === undefined) args.utilityPseudo = "";
    if (args.attribute === undefined) args.attribute = "class";

    const N = args.minify === false ? "\n" : "";
    const S = args.minify === false ? " " : "";

    args.attribute = args.attribute.replace(/:/g, "\\:");

    if (args.pseudo !== undefined && !Array.isArray(args.pseudo)) {
      args.pseudo = [args.pseudo];
    }

    let append = args.utilityPseudo;

    let children = "", parent = "";

    if (args.tiny) {
      if (args.tiny.child && args.tiny.child.length > 0) {
        if (args.tiny.child.startsWith("&")) {
          children = args.tiny.child.replace("&amp;", "").replace("&", "");
        } else {
          children = " " + args.tiny.child;
        }
      }
      if (
        args.tiny.parent &&
        args.tiny.parent.length > 0 &&
        !args.tiny.parent.startsWith("@media")
      ) {
        parent = args.tiny.parent + " ";
      }
    }

    let elementId = '';
    if (args.element) {
      elementId += `[m-id="${args.element}"]`;
    }

    let themes = [""];

    if (args.theme === "default-theme") args.theme = "default";
    if (args.theme === "i-default-theme") args.theme = "i-default";

    if (args.theme !== undefined && args.theme.length > 0) {
      themes = [];

      if (args.theme.startsWith("i-")) {
        let theme = args.theme.substring(2);
        if (theme === "default")
          themes.push(`html:is([m-theme]):not([m-theme="default"]) `);
        else themes.push(`html:not([m-theme="${theme}"]) `);
      } else {
        if (args.theme === "default") {
          themes.push(`html:not([m-theme]) `);
          themes.push(`[m-theme="default"] `);
        } else {
          themes.push(`[m-theme="${args.theme}"] `);
        }
      }
    }
    const pseudos = StringBuilder.pseudos;

    if (this.args.isExtend && args.pseudo === undefined) {
      return args.body;
    }

    if ((args.pseudo.includes("class") || args.pseudo.includes("idle")) &&
      (args.attribute === "class" || args.attribute === "idle")) {
      return getClassString();
    } else {
      return getPseudoString();
    }

    /**
     * Generates CSS string for class attribute.
     * @returns {string} - The generated CSS string.
     */
    function getClassString() {
      let s = parent,
        first = true;
      for (let theme of themes) {
        if (first) first = false;
        else s += `,${N}`;

        if (!_.args.isExtend)
          s += `${theme}${elementId}.${args.className}${children}${append}`;
        else s += `${theme}${elementId}${args.className}${children}${append}`;
      }
      s += `${S}{${N}${S.repeat(4)}${args.body}${N}}${N}`;

      return s;
    }

    /**
     * Generates CSS string for pseudo attributes.
     * @returns {string} - The generated CSS string.
     */
    function getPseudoString() {
      const pseudo = {
        parent: [],
        pseudo: [],
      };

      for (let i of args.pseudo) {
        const p = pseudos[i];
        if (p) {
          if (p.parent) pseudo.parent.push(p.parent);
          if (p.pseudo) pseudo.pseudo.push(p.pseudo);
        }
      }

      const themeSelectors = themes.map((theme) => {
        let s = `${parent}${theme}`;

        if (pseudo.parent.length > 0) {
          s += `${pseudo.parent.join("")} `;
        }

        if (!_.args.isExtend) {
          s += `${elementId}[${args.attribute}~="${args.className}"]`;
        } else {
          s += `${elementId}${args.className}`;
        }

        const c = children.split(",");
        if (c.length > 1) {
          const p = s;
          s = "";
          let f = true;
          for (let i in c) {
            if (c[i]) {
              f ? (f = false) : (s += " ,");
              s += p + " " + c[i].trim();
            }
          }
        } else {
          s += children;
        }

        if (pseudo.pseudo.length > 0) {
          s += `:${pseudo.pseudo.join(":")}`;
        }

        s += append;
        return s;
      });

      let s = themeSelectors.join(`,${N}`);

      s += `${S}{${N}${S.repeat(4)}${args.body}${N}}`;

      s += `${N}`;
      return s;
    }
  }
}

// Define pseudo selectors
StringBuilder.pseudos = {
  _: [
    // :pseudo
    "hover",
    "focus",
    "active",
    "visited",
    "disabled",
    "checked",
    "invalid",
    "valid",
    "optional",
    "read-only",
    "focus-visible",
    "indeterminate",
    "required",
    "empty",

    // ::pseudo
    "before",
    "after",
    "selection",
    "first-letter",
    "first-line",
  ],
  class: {},
  first: {
    pseudo: "first-child",
  },
  last: {
    pseudo: "last-child",
  },
  even: {
    pseudo: "nth-child(even)",
  },
  odd: {
    pseudo: "nth-child(odd)",
  },
  "focus-within": {
    pseudo: "focus-within",
  },
  "not-first": {
    pseudo: "not(:first-child)",
  },
  "not-last": {
    pseudo: "not(:last-child)",
  },
  "not-checked": {
    pseudo: "not(:checked)",
  },
  rtl: {
    parent: "[dir='rtl']",
  },
  ltr: {
    parent: "[dir='ltr']",
  },
  print: {
    media: "print",
  },
};

let pre = "";
for (let pseudos of StringBuilder.pseudos._) {
  if(pseudos === "before")
    pre = ":";
  StringBuilder.pseudos[pseudos] = {
    pseudo :pre + pseudos
  };
}
delete StringBuilder.pseudos._;

for (let i in StringBuilder.pseudos) {
  if (StringBuilder.pseudos.hasOwnProperty(i)) {
    if (StringBuilder.pseudos[i].pseudo) {
      StringBuilder.pseudos["parent-" + i] = {
        parent: "[parent]:" + StringBuilder.pseudos[i].pseudo,
      };
      StringBuilder.pseudos["sibling-" + i] = {
        parent: "[sibling]:" + StringBuilder.pseudos[i].pseudo + " ~",
      };
    }
  }
}
