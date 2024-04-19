/**
 * Class for parsing tiny selector.
 * @class
 */
class Tiny {
  /**
   * Parses a Tiny selector.
   * @param {string} selector - The selector string.
   * @param {object} config - Mojo configuration.
   * @param {array} pseudos - Array of pseudo.
   * @returns {object} - The parsed selector object.
   */
  parseTiny(selector, config, pseudos) {
    if (typeof selector !== typeof "")
      return selector;

    selector = fixString(selector);

    let result = {
      parent: "",
      child: ""
    }

    if (selector !== "this") {
      if (selector.startsWith("<")) {
        result.parent = selector;
        if (selector.includes("{")) {
          let bracketRegex = /{([^{}]+)}/;
          result.child = fixString(selector.match(bracketRegex)[1]);
          result.parent = fixString(selector.replace(bracketRegex, ""));
        }
        result.parent = fixString(result.parent.replace("<", ""));
      } else {
        result.child = selector;
      }
    }

    result.args = {};
    const setTinyArgs = (s) =>{
      if(s.startsWith("@")) {
        const sSpl = s.substring(1).split(" ");
        const dSpl = sSpl[0].split(":");
        let removeAt = false;
        const pseudo = [];
        for(let v of dSpl){
          let c = v;
          if(c.startsWith("i-"))
            c = c.substring(2);
          if (config.base.themes[c]) {
            result.args.theme = v;
            removeAt = true;
          } else if (config.base.breakpoints[c]) {
            result.args.breakpoint = v;
            removeAt = true;
          } else if (pseudos.includes(v)) {
            pseudo.push(v);
            removeAt = true;
          }
        }
        if(pseudo.length > 0){
          result.args.pseudo = pseudo;
        }
        if(removeAt){
          sSpl.shift();
          s = sSpl.join(" ").trim();
        }
      }
      return s;
    }

    result.parent = setTinyArgs(result.parent);
    result.child  = setTinyArgs(result.child);

    return result;

    function fixString(str) {
      return str.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');
    }
  }
}

export default Tiny;
