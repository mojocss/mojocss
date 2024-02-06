export default class StringBuilder {
  constructor(args) {
    this.args = args;
  }

  getCss() {
    const _ = this;
    const args = this.args;
    if (args.utilityPseudo === undefined) args.utilityPseudo = "";
    if (args.attribute === undefined) args.attribute = "class";

    let N = "",
      S = "";
    if (args.minify === false) {
      N = "\n";
      S = " ";
    }

    args.attribute = args.attribute.replace(/:/g, "\\:");

    if (args.pseudo !== undefined && !Array.isArray(args.pseudo)) {
      args.pseudo = [args.pseudo];
    }

    let append = args.utilityPseudo;

    let children = "",
      parent = "";
    if (args.children !== undefined) {
      const childArr = args.children.split("-");
      childArr.shift();
      let cType = childArr.pop();
      if (cType !== "first" && cType !== "all") {
        childArr.push(cType);
        cType = "first";
      }

      let childTag = childArr.join("-");
      if (childTag.replace(/ /g, "").length === 0) childTag = "*";

      if (cType === "first") children += " > " + childTag;
      else if (cType === "all") children += " " + childTag;
    }

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

    if (args.element) {
      parent += `[m-id="${args.element}"]`;
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

    if (
      (args.pseudo.includes("class") || args.pseudo.includes("idle")) &&
      (args.attribute === "class" || args.attribute === "idle")
    ) {
      return getClassString();
    } else {
      return getPseudoString();
    }

    function getClassString() {
      let s = parent,
        first = true;
      for (let theme of themes) {
        if (first) first = false;
        else s += `,${N}`;

        if (!_.args.isExtend)
          s += `${theme}.${args.className}${children}${append}`;
        else s += `${theme}${args.className}${children}${append}`;
      }
      s += `${S}{${N}${S}${S}${S}${S}${args.body}${N}}${N}`;

      return s;
    }

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
          s += `[${args.attribute}~="${args.className}"]`;
        } else {
          s += args.className;
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

      s += `${S}{${N}${S}${S}${S}${S}${args.body}${N}}`;

      s += `${N}`;
      return s;
    }
  }
}

StringBuilder.pseudos = {
  class: {},
  hover: {
    pseudo: "hover",
  },
  focus: {
    pseudo: "focus",
  },
  active: {
    pseudo: "active",
  },
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
  visited: {
    pseudo: "visited",
  },
  "not-first": {
    pseudo: "not(:first-child)",
  },
  "not-last": {
    pseudo: "not(:last-child)",
  },
  disabled: {
    pseudo: "disabled",
  },
  checked: {
    pseudo: "checked",
  },
  "not-checked": {
    pseudo: "not(:checked)",
  },
  invalid: {
    pseudo: "invalid",
  },
  valid: {
    pseudo: "valid",
  },
  optional: {
    pseudo: "optional",
  },
  "read-only": {
    pseudo: "read-only",
  },
  "focus-visible": {
    pseudo: "focus-visible",
  },
  indeterminate: {
    pseudo: "indeterminate",
  },
  required: {
    pseudo: "required",
  },
  empty: {
    pseudo: "empty",
  },
  before: {
    pseudo: ":before",
  },
  after: {
    pseudo: ":after",
  },
  selection: {
    pseudo: ":selection",
  },
  "first-letter": {
    pseudo: ":first-letter",
  },
  "first-line": {
    pseudo: ":first-line",
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
