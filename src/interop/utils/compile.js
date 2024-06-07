/**
 * Compile and get CSS using DOM and mojo core.
 * @class
 */
export default class Compile {
  /**
   * Attribute types for pseudo-classes, breakpoints, and themes.
   */
  static ATTRIBUTE_TYPE_PSEUDO = 0;
  static ATTRIBUTE_TYPE_BREAKPOINT = 1;
  static ATTRIBUTE_TYPE_THEME = 2;
  
  /**
   * Initializes the Compile instance.
   * @param {Document} document - The document object.
   * @param {MojoCore} core - The core object.
   */
  constructor(document, core) {
    this.core = core;
    this.document = document;
    this.allPseudos = this.core.getPseudos();
    this.attrCache = [];
    this.typeCache = [];
  }
  
  /**
   * Compiles Mojo CSS utilities to CSS styles.
   * @returns {Object}
   */
  compile() {
    const config = this.core.config;
    const { separator } = config.options;
    const usedAttributes = this.findUsedAttributes();

    let attrs = Object.keys(usedAttributes);
    let breakpoints = Object.keys(config.base.breakpoints);
    let themes = Object.keys(config.base.themes);
    let reverseBreakpoints = breakpoints.filter(breakpoint => breakpoint !== "default").map(breakpoint => "i-" + breakpoint).reverse();
    let vbo = [...this.allPseudos, "default-theme", ...themes, ...breakpoints, ...reverseBreakpoints];
    let vb = vbo.flatMap(item => [item, "m-" + item]);
    
    attrs.sort(function (a, b) {
      let aSplit = a.split(separator);
      let bSplit = b.split(separator);
      let sum = 0;
      for (let i in aSplit) {
        for (let j in bSplit) {
          sum += vb.indexOf(aSplit[i]) - vb.indexOf(bSplit[j]);
        }
      }
      return sum;
    });
    
    
    const result = {
      utilities: "",
      transitions: ""
    };
    
    for (let attr of attrs) {
      const styles = this.getCoreCSS(usedAttributes[attr]);
      result.utilities += styles.utilities;
      result.transitions += styles.transitions;
    }

    const tiny = this.getTinyCSS();
    result.utilities += tiny.utilities;
    result.transitions += tiny.transitions;

    return result;
  }
  
  /**
   * Finds used attributes in the document.
   * @returns {Object} - Used attributes.
   */
  findUsedAttributes() {
    let attributes = {};

    const processAttribute = (attributeName, attributeValue) => {
      if (this.attrCache[attributeName] && typeof this.attrCache[attributeName] == "object") {
        attributes[attributeName] = this.attrCache[attributeName];
        attributes[attributeName].value += " " + attributeValue;
      } else {
        let attr = {}, add = false;
        let attributeSplit = attributeName.split(this.core.config.options.separator);
        for (let attrName of attributeSplit) {
          if (attrName.startsWith("m-"))
            attrName = attrName.substring(2);
          let type = this.findAttributeType(attrName);
          if (type > -1) {
            switch (type) {
              case Compile.ATTRIBUTE_TYPE_PSEUDO:
                if (!attr.pseudo) attr.pseudo = [];
                attr.pseudo.push(attrName);
                break;
              case Compile.ATTRIBUTE_TYPE_BREAKPOINT:
                attr.breakpoint = attrName;
                break;
              case Compile.ATTRIBUTE_TYPE_THEME:
                attr.theme = attrName;
                break;
            }
            add = true;
          }
        }
        if (add) {
          attr.name = attributeName;
          attr.value = attributeValue;
          this.attrCache[attributeName] = attributes[attributeName] = attr;
        }
      }
    }
    
    this.document.querySelectorAll("body,body *").forEach((el) => {
      for (const attribute of el.attributes) {
        if (attribute.name && attribute.value) {
          const attributeName = (attribute.name === "className") ? "class" : attribute.name;
          const attributeValue = attribute.value.replace(/\s+/g, " ");
          
          processAttribute(attributeName, attributeValue);
        }
      }
    });
    
    const {whitelist} = this.core.config;
    if (whitelist) {
      for (let i in whitelist) {
        if (whitelist.hasOwnProperty(i)) {
          const attributeName = (i === "idle") ? "class" : i;
          const attributeValue = whitelist[i].replace(/\s+/g, " ").trim();
          
          processAttribute(attributeName, attributeValue);
        }
      }
    }
    
    return attributes;
  }
  
  /**
   * Finds the type of an attribute.
   * @param {string} attribute - The attribute name.
   * @returns {number} - The type of the attribute.
   */
  findAttributeType(attribute) {
    if (this.typeCache[attribute]) {
      return this.typeCache[attribute];
    }
    const base = this.core.config.base;
    
    if (attribute.startsWith("i-"))
      attribute = attribute.substring(2);
    
    if (attribute === "default-theme") attribute = "default";
    
    let result = -1;
    
    if (this.allPseudos.includes(attribute)) {
      result = Compile.ATTRIBUTE_TYPE_PSEUDO;
    } else if (base.themes[attribute] !== undefined) {
      result = Compile.ATTRIBUTE_TYPE_THEME;
    } else if (base.breakpoints[attribute] !== undefined) {
      result = Compile.ATTRIBUTE_TYPE_BREAKPOINT;
    }
    
    this.typeCache[attribute] = result;
    
    return result;
  }
  
  /**
   * Retrieves CSS styles for a given attribute.
   * @param {Object} attribute
   * @returns {Object}
   */
  getCoreCSS(attribute) {
    let result = {
      utilities: "",
      transitions: ""
    };
    
    const spl = this.splitClasses(attribute.value);
    
    let opt = {
      isExtend: false,
      pseudo: attribute.pseudo ? attribute.pseudo : "class",
      breakpoint: attribute.breakpoint,
      theme: attribute.theme,
      attribute: attribute.name,
      classes: spl.classes,
    };
    
    result.utilities = this.core.init(opt).getStyles().css;
    
    opt.classes = spl.transitions;
    result.transitions = this.core.init(opt).getStyles().css;
    
    return result;
  }
  
  /**
   * Retrieves tiny CSS styles.
   * @returns {Object}
   */
  getTinyCSS() {
    let result = {
      utilities: "",
      transitions: ""
    };
    
    const tinyAttr = ["_", "m_"];
    for (let ta in tinyAttr) {
      let id = 0;
      this.document.querySelectorAll("[" + tinyAttr[ta] + "]").forEach((el) => {
        if (!el.hasAttribute("m-id"))
          el.setAttribute("m-id", (++id).toString())
        
        let value = el.getAttribute(tinyAttr[ta]).replace(/\s+/g, " ")
        let tArr = this.parseTiny(value);
        
        for (let i in tArr) {
          const spl = this.splitClasses(tArr[i].rules);
          const selectors = tArr[i].selector.split(",");
          for (let selector of selectors) {
            let opt = {
              isExtend: false,
              pseudo: "class",
              attribute: tinyAttr[ta],
              tiny: selector,
              element: el.getAttribute("m-id"),
              classes: spl.classes,
            };

            result.utilities += this.core.init(opt).getStyles().css;

            opt.classes = spl.transitions;
            result.transitions += this.core.init(opt).getStyles().css;
          }
        }
        
      });
    }
    
    return result;
  }
  
  /**
   * Split and sort class list string.
   * @param {string} string
   * @returns {Object}
   */
  splitClasses(string) {
    let variantSplit = string.split(" ");
    let classes = new Set([...variantSplit.filter(c => !c.startsWith("ts-") && !c.startsWith("transition") && !c.includes("-alpha-"))]);
    let transitions = new Set([...variantSplit.filter(c => c.startsWith("ts-") || c.startsWith("transition"))]);
    let alphaClasses = new Set([...variantSplit.filter(c => c.includes("-alpha-"))]);
  
    return {
      classes: [...classes, ...alphaClasses],
      transitions: [...transitions]
    }
  }
  
  /**
   * Parses tiny CSS rules.
   * @param {string} string - The tiny CSS string.
   * @returns {Array} - Parsed tiny CSS objects.
   */
  parseTiny(string) {
    string = string
      .replace(/[\n\t\r]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const objects = [];
    const chars = string.split('');

    let stack = [], beforeChar = '', isSelector, obj = {selector: '', rules: ''};
    chars.map(char => {
      if(char === "("){
        if(stack.length === 0 && beforeChar !== '-'){
          isSelector = true;
          if(obj.selector && obj.rules) {
            objects.push(obj);
          }
          obj = {selector: '', rules: ''};
        }

        stack.push(1);
      }

      if(isSelector){
        if(stack.length !== 1 || (char !== "(" && char !== ")"))
          obj.selector += char;
      } else {
        obj.rules += char;
      }

      if(char === ")"){
        stack.pop();

        if(stack.length === 0){
          isSelector = false;
        }
      }

      beforeChar = char;
    })
    objects.push(obj)

    return objects;
  }
}