/**
 * Defines values for utilities.
 * @class
 */
export default class StaticValues {
  /**
   * Initializes the StaticValues instance.
   * @param {Object} args - The arguments object.
   */
  constructor(args) {
    this.args = args;
  }

  /**
   * Retrieves static CSS values.
   * @returns {Object} - The object containing static CSS values.
   */
  get() {
    const {definedValues} = this.args.config.base;
    return {
      _: {
        full: "100%",
        half: "50%",
        fullvw: "100vw",
        fullvh: "100vh",
      },
      "text-w": {
        ...definedValues.fontWeight,
      },
      "text-ls": {
        ...definedValues.letterSpacing,
      },
      "text-lh": {
        ...definedValues.lineHeight,
      },
      shadow: {
        ...definedValues.boxShadow,
      },
      order: {
        first: "-1",
        last: "99999",
        none: "0",
      },
      _i_rounded: {
        full: "999rem",
        none: "0",
        ...definedValues.borderRadius,
      },
    };
  }
}
