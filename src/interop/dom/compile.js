export default class Compile {
  constructor(cssModule) {
    this.cssModule = cssModule;
  }

  compile() {
    const allPseudos = this.cssModule.getPseudos();
    const config = this.cssModule.config;
    const cssModule = this.cssModule;
    const typeCache = [];

    const usedAttributes = findUsedAttributes();

    let markups = document.documentElement.outerHTML;
    markups = markups.replace(/className=/g, "class=").replace(/\s+/g, " ");

    if (config.whitelist !== undefined) {
      markups += "<i ";
      for (let i in config.whitelist) {
        if(config.whitelist.hasOwnProperty(i)) {
          let name = i;
          if (name === "idle") name = "class";
          markups += `${name}="${config.whitelist[i]}" `;
        }
      }
      markups += "></i>";
    }

    let attrs = Object.keys(usedAttributes.attributes);
    let breakpoints = Object.keys(config.base.breakpoints);
    let reverseBreakpoints = breakpoints.filter(breakpoint => breakpoint !== "default").map(breakpoint => "i-" + breakpoint).reverse();
    let vbo = [...allPseudos, ...breakpoints, ...reverseBreakpoints];
    let vb = vbo.flatMap(item => [item, "m-" + item]);

    attrs.sort(function (a, b) {
      let aSplit = a.split(":");
      let bSplit = b.split(":");
      let sum = 0;
      for (let i in aSplit) {
        for (let j in bSplit) {
          sum += vb.indexOf(aSplit[i]) - vb.indexOf(bSplit[j]);
        }
      }
      return sum;
    });

    let css = "";

    let types = [];

    for (let attr of attrs) {
      if (usedAttributes.attributes[attr].tiny === undefined)
        types.push(
          getPseudoObj(
            usedAttributes.attributes[attr].pseudo === undefined
              ? "class"
              : usedAttributes.attributes[attr].pseudo,
            usedAttributes.attributes[attr].breakpoint,
            usedAttributes.attributes[attr].theme,
            usedAttributes.attributes[attr].children,
            usedAttributes.attributes[attr].tiny,
            attr
          )
        );
    }

    let ts = "";
    Object.entries(types)
      .filter(([, value]) => markups.includes(value.name))
      .forEach(([, value]) => {
        let vc = getCoreCSS(markups, value);
        css += vc.css;
        ts += vc.ts;
      });


    const tinyAttr = ["_", "m_"];
    for (let ta in tinyAttr) {
      document.querySelectorAll("[" + tinyAttr[ta] + "]").forEach(function (el) {
        let variant_str = el.getAttribute(tinyAttr[ta])
        variant_str = variant_str.replace(/  +/g, ' ');
        let tArr = parseTiny(variant_str);

        for (let i in tArr) {
          let variant_spl = tArr[i].rules.split(" ");
          let classes = new Set();
          let transitions = new Set();
          let alphaclasses = new Set();
          for (let i in variant_spl) {
            if (
              variant_spl[i].startsWith("ts-") ||
              variant_spl[i].startsWith("transition")
            ) {
              transitions.add(variant_spl[i]);
            } else if (variant_spl[i].includes("-alpha-")) {
              alphaclasses.add(variant_spl[i]);
            } else {
              classes.add(variant_spl[i]);
            }
          }
          classes = [...classes, ...alphaclasses];
          transitions = [...transitions];

          let opt = {
            isExtend: false,
            pseudo: "class",
            attribute: tinyAttr[ta],
            tiny: tArr[i].selector,
            element: el.getAttribute("m-id"),
            classes: classes,
          };

          let res = cssModule.init(opt).getStyles();
          css += res.css + " ";

          opt.classes = transitions;
          res = cssModule.init(opt).getStyles();
          ts += res.css + " ";
        }
      })
    }

    return {
      css,
      ts,
    };

    function getPseudoObj(pseudo, breakpoint, theme, children, tiny, regexMid) {
      return {
        name: regexMid,
        pseudo,
        regex: new RegExp("(^|[^:!-])" + regexMid + '="(.*?)"', "g"),
        breakpoint,
        theme,
        children,
        tiny,
      };
    }


    function findUsedAttributes() {
      let attributes = {};

      let count = 0;
      document.querySelectorAll("body,body *").forEach(function (el) {
        for (const attribute of el.attributes) {
          if (attribute.nodeName !== undefined) {
            if (attribute.nodeName.includes(":")) {
              let attr = {pseudo: []}, add = false;
              let s = attribute.nodeName.split(":");
              for (let j in s) {
                let attrName = s[j];
                if (attrName.startsWith("m-"))
                  attrName = attrName.substring(2);

                let type = findAttributeType(attrName);
                switch (parseInt(type)) {
                  case 0:
                    attr.theme = attrName;
                    break;
                  case 1:
                    attr.breakpoint = attrName;
                    break;
                  case 2:
                    attr.pseudo.push(attrName);
                    break;
                  case 3:
                    attr.children = attrName;
                    break;
                  case 4:
                    attr.tiny = ++count;
                    el.setAttribute("m-id", count.toString());
                    break;
                }

                if (type >= 0)
                  add = true;
              }
              //if (attr.theme || attr.breakpoint || attr.pseudo)
              if (add)
                attributes[attribute.nodeName] = attr;
            } else {
              let attrName = attribute.nodeName;
              if (attrName.startsWith("m-"))
                attrName = attrName.substring(2);

              let type = findAttributeType(attrName);

              switch (parseInt(type)) {
                case 0:
                  attributes[attribute.nodeName] = {
                    theme: attrName,
                  };
                  break;
                case 1:
                  attributes[attribute.nodeName] = {
                    breakpoint: attrName,
                  };
                  break;
                case 2:
                  attributes[attribute.nodeName] = {
                    pseudo: attrName,
                  };
                  break;
                case 3:
                  attributes[attribute.nodeName] = {
                    children: attrName,
                  };
                  break;
                case 4:
                  attributes[attribute.nodeName] = {
                    tiny: ++count,
                  };
                  el.setAttribute("m-id", count.toString());
                  break;
              }
            }
          }
        }
      });


      return {
        attributes: attributes,
      };
    }

    function parseTiny(tString) {
      const objects = [];
      const ruleRegex = /\(([^()]|\(([^()]+)\))*\)\s*(.*?)(?=\s*\(|$)/g;
      let match;
      while ((match = ruleRegex.exec(tString)) !== null) {
        const selector = match[0]
          .match(/\(([^()]|\(([^()]+)\))*\)/)[0]
          .replace(/^\(|\)$/g, "");
        const rules = match[3];
        const newObj = {selector, rules};

        objects.push(newObj);
      }
      return objects;
    }

    function findAttributeType(attribute) {
      if (typeCache[attribute]) {
        return typeCache[attribute];
      }

      if (attribute.startsWith("i-")) attribute = attribute.substring(2);

      if (attribute === "default-theme") attribute = "default";

      let result = -1;

      if (config.base.themes[attribute] !== undefined) {
        result = 0;
      } else if (config.base.breakpoints[attribute] !== undefined) {
        result = 1;
      } else if (allPseudos.includes(attribute)) {
        result = 2;
      } else if (attribute.startsWith("children")) {
        result = 3;
      } else if (attribute === "_" || attribute === "m_") {
        result = 4;
      }

      typeCache[attribute] = result;

      return result;
    }

    function getCoreCSS(str, type) {
      let css = "";
      let ts = "";

      let variant_arr = str.match(type.regex);
      if (variant_arr) {
        let variant_str = variant_arr.map(item => item.split('"')[1]).join(' ');
        variant_str = variant_str.replace(/  +/g, ' ');

        let tArr = [{
          selector: "",
          rules: variant_str,
        }];
        if (type.tiny) {
          tArr = parseTiny(variant_str);
        }

        for (let tiny of tArr) {
          let variant_spl = tiny.rules.split(" ");
          let classes = new Set([...variant_spl]);
          let transitions = new Set([...variant_spl.filter(c => c.startsWith("ts-") || c.startsWith("transition"))]);
          let alphaClasses = new Set([...variant_spl.filter(c => c.includes("-alpha-"))]);

          classes = [...classes, ...alphaClasses];
          transitions = [...transitions];

          let opt = {
            isExtend: false,
            pseudo: type.pseudo,
            breakpoint: type.breakpoint,
            theme: type.theme,
            children: type.children,
            attribute: type.name,
            tiny: tiny.selector,
            classes,
          };

          let res = cssModule.init(opt).getStyles();
          css += res.css + " ";

          opt.classes = transitions;
          res = cssModule.init(opt).getStyles();
          ts += res.css + " ";
        }
      }

      return {
        css,
        ts,
      };
    }

  }
}
