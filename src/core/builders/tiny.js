class Tiny {
  parseTiny(selector) {
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

    return result;


    function fixString(str) {
      return str.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');
    }
  }
}

export default Tiny;
