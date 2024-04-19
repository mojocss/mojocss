/**
 * Class representing CapsuleLoader, responsible for loading capsules.
 * @class
 */
export default class CapsuleLoader {
  /**
   * Constructor for CapsuleLoader.
   * @param {Object} args - Arguments containing configuration, core, append function, addPatterns function, and setConfig function.
   */
  constructor(args) {
    const { config, core, append, addPatterns, setConfig } = args;

    // Create a copy of the config without capsules, utilities, and patterns
    let c = {...config};
    delete c.capsules;
    delete c.utilities;
    delete c.patterns;

    let capsules = config.capsules;
    if (args.capsules) {
      capsules = args.capsules;
    }

    for (let i in capsules) {
      if (capsules.hasOwnProperty(i)) {
        let func,
          options = {};
        // Check if capsule is a function or an object with capsule and options
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
        // Call capsule function with Capsule instance
        if (func) {
          try {
            func.call(
              new Capsule({
                options: options,
                config: c,
                core,
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

/**
 * Class representing a Capsule, providing capsule-related functionalities.
 * @class
 */
class Capsule {
  /**
   * Constructor for Capsule.
   * @param {Object} args - Arguments containing version, options, config, core, append function, addPatterns function, and setConfig function.
   */
  constructor(args) {
    // Destructuring arguments
    const { options, config, core, append, addPatterns, setConfig } = args;

    // Assigning properties
    this.mojoVersion = core.version;
    this.config = config;
    this.options = options;

    // Function to load capsules
    this.load = function (capsules) {
      if (!Array.isArray(capsules)) {
        capsules = [capsules];
      }

      // Instantiate CapsuleLoader with provided capsules
      new CapsuleLoader({
        capsules,
        config,
        core,
        append,
        setConfig,
        addPatterns,
      });
    };

    // Function to add utility
    this.addUtility = function (obj) {
      core.addUtility(obj);
    };

    // Function to add variant
    this.addVariant = function (name, obj) {
      core.addPseudo(name, obj);
    };

    // Function to set configuration
    this.setConfig = setConfig;

    // Function to append CSS
    this.appendCSS = append;

    // Function to add patterns
    this.addPatterns = addPatterns;

    // Function to get patterns CSS
    this.getPatternsCSS = function (pattern) {
      return core.getPatternStyles(pattern);
    };

    // Function to get utilities CSS
    this.getUtilitiesCSS = function (utilities) {
      if (!Array.isArray(utilities)) utilities = utilities.split(" ");

      let opt = {
        classes: utilities,
        isExtend: true,
      };
      return core.init(opt).getStyles().css;
    };
  }
}
