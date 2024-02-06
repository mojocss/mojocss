export default class CapsuleLoader {
  constructor(args) {
    const config = args.config,
      cssModule = args.cssModule,
      append = args.append,
      addPatterns = args.addPatterns,
      setConfig = args.setConfig;

    let c = {...config};
    delete c.capsules;
    delete c.utilities;
    delete c.patterns;

    let capsules = config.capsules;
    if (args.capseles) {
      capsules = args.capseles;
    }

    for (let i in capsules) {
      if (capsules.hasOwnProperty(i)) {
        let func,
          options = {};
        if (typeof capsules[i] === "function") {
          func = capsules[i];
        }
        if (
          typeof capsules[i] === "object" &&
          typeof capsules[i]["capsule"] === "function"
        ) {
          func = capsules[i]["capsule"];

          if (
            capsules[i]["options"] &&
            typeof capsules[i]["options"] === "object"
          )
            options = capsules[i]["options"];
        }
        if (func) {
          try {
            func.call(
              new Capsule({
                options: options,
                config: c,
                cssModule,
                append,
                addPatterns,
                setConfig,
              })
            );
          } catch (e) {
            console.warn(e);
          }
        }
      }
    }
  }
}

class Capsule {
  constructor(args) {
    this.config = args.config;

    this.options = args.options;

    this.load = function (capseles) {
      if (!Array.isArray(capseles)) {
        capseles = [capseles];
      }

      new CapsuleLoader({
        capseles,
        config: args.config,
        cssModule: args.cssModule,
        append: args.append,
        setConfig: args.setConfig,
        addPatterns: args.addPatterns,
      });
    };

    this.addUtility = function (obj) {
      args.cssModule.addUtility(obj);
    };

    this.addVariant = function (name, obj) {
      args.cssModule.addPseudo(name, obj);
    };

    this.setConfig = args.setConfig;

    this.appendCSS = args.append;

    this.addPatterns = args.addPatterns;

    this.getPatternsCSS = function (pattern) {
      return args.cssModule.getPatternStyles(pattern);
    };

    this.getUtilitiesCSS = function (utilities) {
      if (!Array.isArray(utilities)) utilities = utilities.split(" ");

      let opt = {
        classes: utilities,
        isExtend: true,
      };
      return args.cssModule.init(opt).getStyles().css;
    };
  }
}
